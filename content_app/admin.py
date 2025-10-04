from django.contrib import admin
from .models import Banner, Offer


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "is_active", "order", "updated_at")
    list_editable = ("is_active", "order")
    search_fields = ("title",)
    list_filter = ("is_active",)
    ordering = ("order", "id")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "is_featured", "price_from", "order", "updated_at")
    list_editable = ("is_featured", "order")
    search_fields = ("title", "subtitle")
    list_filter = ("is_featured",)
    ordering = ("order", "id")
    readonly_fields = ("created_at", "updated_at")
