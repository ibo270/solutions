from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters, permissions, status
from rest_framework.response import Response

from .models import Company, Flight
from .serializers import (
    CompanySerializer,
    FlightReadSerializer,
    FlightWriteSerializer,
)
from .permissions import IsCompanyManagerRole


class FlightSearchView(generics.ListAPIView):
    """
    Поиск рейсов.
    Поддерживаем query-параметры:
      - origin, destination, company_code
      - date_from, date_to (ISO 8601)
      - price_gte, price_lte
      - ordering (по умолчанию departure_at)
      - search (по flight_no)
    """
    serializer_class = FlightReadSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    search_fields = ["flight_no"]
    ordering = ["departure_at"]

    def get_queryset(self):
        qs = Flight.objects.select_related("company").all()

        p = self.request.query_params
        if p.get("origin"):
            qs = qs.filter(origin__iexact=p["origin"])
        if p.get("destination"):
            qs = qs.filter(destination__iexact=p["destination"])
        if p.get("company_code"):
            qs = qs.filter(company__code__iexact=p["company_code"])

        # даты
        if p.get("date_from"):
            qs = qs.filter(departure_at__date__gte=p["date_from"])
        if p.get("date_to"):
            qs = qs.filter(departure_at__date__lte=p["date_to"])

        # цена
        if p.get("price_gte"):
            qs = qs.filter(base_price__gte=p["price_gte"])
        if p.get("price_lte"):
            qs = qs.filter(base_price__lte=p["price_lte"])

        return qs


class FlightRetrieveView(generics.RetrieveAPIView):
    queryset = Flight.objects.select_related("company").all()
    serializer_class = FlightReadSerializer


class CompanyFlightCreateView(generics.CreateAPIView):
    """
    Создание рейса менеджером компании.
    В теле нужно поле company_code (код компании менеджера).
    """
    serializer_class = FlightWriteSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyManagerRole]

    def perform_create(self, serializer):
        code = serializer.validated_data.get("company_code")
        # менеджер должен быть в managers компании
        company = get_object_or_404(Company, code=code, managers=self.request.user)
        # создаём через create() сериалайзера (он сам поставит seats_available)
        serializer.save(company_code=company.code)


class CompanyFlightUpdateView(generics.UpdateAPIView):
    """
    Редактирование рейса, принадлежащего компаниям менеджера.
    """
    serializer_class = FlightWriteSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyManagerRole]

    def get_queryset(self):
        return Flight.objects.filter(company__managers=self.request.user)

    def get_serializer_class(self):
        # отдаём назад «read» версию после обновления
        if self.request.method in ("PUT", "PATCH"):
            return FlightWriteSerializer
        return FlightReadSerializer


class CompanyPassengersView(generics.ListAPIView):
    """
    Пассажиры текущего рейса для менеджера компании.
    Использует tickets.TicketSerializer (который ты уже сделал).
    """
    permission_classes = [permissions.IsAuthenticated, IsCompanyManagerRole]

    def list(self, request, *args, **kwargs):
        from tickets.models import Ticket
        from tickets.serializers import TicketSerializer
        flight_id = kwargs.get("pk")
        qs = Ticket.objects.select_related("user", "flight").filter(
            flight__id=flight_id, flight__company__managers=request.user
        )
        data = TicketSerializer(qs, many=True).data
        return Response(data, status=status.HTTP_200_OK)
