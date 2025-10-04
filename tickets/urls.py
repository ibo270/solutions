from django.urls import path
from .views import TicketPurchaseView, MyTicketsView, TicketCancelView

app_name = "tickets"

urlpatterns = [
    path("tickets/", TicketPurchaseView.as_view(), name="purchase"),       # POST {flight_id}
    path("tickets/my/", MyTicketsView.as_view(), name="my"),               # GET
    path("tickets/<int:pk>/cancel/", TicketCancelView.as_view(), name="cancel"),  # POST
]
