from django.urls import path
from .views import (
    FlightSearchView,
    FlightRetrieveView,
    CompanyFlightCreateView,
    CompanyFlightUpdateView,
    CompanyPassengersView,
)

app_name = "airlines"

urlpatterns = [
    path("flights/", FlightSearchView.as_view(), name="flights-search"),                   # GET
    path("flights/<int:pk>/", FlightRetrieveView.as_view(), name="flights-detail"),       # GET
    path("company/flights/", CompanyFlightCreateView.as_view(), name="company-flights-create"),  # POST
    path("company/flights/<int:pk>/", CompanyFlightUpdateView.as_view(), name="company-flights-update"),  # PATCH/PUT
    path("company/flights/<int:pk>/passengers/", CompanyPassengersView.as_view(), name="company-flights-passengers"),  # GET
]
