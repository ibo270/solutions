from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from airlines.models import Flight
from .models import Ticket
from .serializers import TicketSerializer, TicketCreateSerializer


class TicketPurchaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ser = TicketCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        flight = get_object_or_404(Flight, pk=ser.validated_data["flight_id"])

        try:
            ticket = Ticket.purchase(request.user, flight)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"confirmation_id": str(ticket.confirmation_id), "ticket_id": ticket.id},
            status=status.HTTP_201_CREATED,
        )


class MyTicketsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Ticket.objects.select_related("flight", "user")
            .filter(user=request.user)
            .order_by("-booked_at")
        )
        return Response(TicketSerializer(qs, many=True).data)


class TicketCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk: int):
        ticket = get_object_or_404(Ticket, pk=pk, user=request.user)
        before = ticket.status
        ticket.cancel()
        return Response(
            {
                "ticket_id": ticket.id,
                "previous_status": before,
                "status": ticket.status,
                "canceled_at": ticket.canceled_at,
            },
            status=status.HTTP_200_OK,
        )
