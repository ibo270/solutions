from rest_framework import serializers
from .models import Banner, Offer


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = (
            "id",
            "title",
            "image_url",
            "link_url",
            "is_active",
            "order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = (
            "id",
            "title",
            "subtitle",
            "price_from",
            "is_featured",
            "order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
