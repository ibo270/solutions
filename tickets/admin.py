from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("id", "confirmation_id", "user", "flight", "status", "price_paid", "booked_at")
    list_filter = ("status", "flight__company")
    search_fields = ("confirmation_id", "user__username", "flight__flight_no")
    readonly_fields = ("confirmation_id", "booked_at", "canceled_at", "price_paid")
