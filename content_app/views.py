from rest_framework import generics
from .models import Banner, Offer
from .serializers import BannerSerializer, OfferSerializer

class BannerListView(generics.ListAPIView):
    queryset = Banner.objects.filter(is_active=True).order_by('order')
    serializer_class = BannerSerializer

class OfferListView(generics.ListAPIView):
    queryset = Offer.objects.all().order_by('order')
    serializer_class = OfferSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import generics, permissions
from .models import Banner, Offer
from .serializers import BannerSerializer, OfferSerializer


CACHE_SECONDS = 60  # можно поднять до 300 в проде


@method_decorator(cache_page(CACHE_SECONDS), name="dispatch")
class BannerListView(generics.ListAPIView):
    """
    Публичные активные баннеры, отсортированные по order.
    GET /api/content/banners/
    """
    permission_classes = [permissions.AllowAny]
    queryset = Banner.objects.filter(is_active=True).order_by("order", "id")
    serializer_class = BannerSerializer
    pagination_class = None  # обычно баннеров немного — отдаём без пагинации


@method_decorator(cache_page(CACHE_SECONDS), name="dispatch")
class OfferListView(generics.ListAPIView):
    """
    Публичные офферы, отсортированные по order.
    GET /api/content/offers/
    """
    permission_classes = [permissions.AllowAny]
    queryset = Offer.objects.all().order_by("order", "id")
    serializer_class = OfferSerializer
    pagination_class = None
