from rest_framework import serializers
from .models import Company, Flight

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ("id", "name", "code", "is_active")


# Чтение (для списка/деталей)
class FlightReadSerializer(serializers.ModelSerializer):
    company_code = serializers.CharField(source="company.code", read_only=True)

    class Meta:
        model = Flight
        fields = (
            "id",
            "company_code",
            "flight_no",
            "origin",
            "destination",
            "departure_at",
            "arrival_at",
            "base_price",
            "seats_total",
            "seats_available",
            "status",
        )


# Создание/обновление (company_code пишем в тело)
class FlightWriteSerializer(serializers.ModelSerializer):
    company_code = serializers.CharField(write_only=True)

    class Meta:
        model = Flight
        fields = (
            "company_code",
            "flight_no",
            "origin",
            "destination",
            "departure_at",
            "arrival_at",
            "base_price",
            "seats_total",
            "status",
        )

    def create(self, validated_data):
        code = validated_data.pop("company_code")
        from django.shortcuts import get_object_or_404
        company = get_object_or_404(Company, code=code)
        # seats_available = seats_total при создании
        seats_total = validated_data.get("seats_total") or 100
        obj = Flight.objects.create(company=company, seats_total=seats_total,
                                    seats_available=seats_total, **validated_data)
        return obj

    def update(self, instance, validated_data):
        # company_code игнорируем при PATCH/PUT
        validated_data.pop("company_code", None)
        return super().update(instance, validated_data)
