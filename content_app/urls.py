from django.urls import path
from .views import BannerListView, OfferListView

app_name = "content_app"

urlpatterns = [
    path("content/banners/", BannerListView.as_view(), name="banners-list"),
    path("content/offers/", OfferListView.as_view(), name="offers-list"),
]
