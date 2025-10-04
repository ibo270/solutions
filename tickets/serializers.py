from rest_framework import serializers
from .models import Ticket
from airlines.models import Flight


class FlightMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = (
            "id",
            "company",
            "flight_no",
            "origin",
            "destination",
            "departure_at",
            "arrival_at",
        )


class TicketSerializer(serializers.ModelSerializer):
    flight = FlightMiniSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = (
            "id",
            "confirmation_id",
            "price_paid",
            "status",
            "booked_at",
            "canceled_at",
            "flight",
        )
        read_only_fields = fields  # всё read-only на выдаче


class TicketCreateSerializer(serializers.Serializer):
    flight_id = serializers.IntegerField(min_value=1)

    def validate_flight_id(self, value):
        if not Flight.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Flight not found")
        return value
