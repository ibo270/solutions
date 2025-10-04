import uuid
from django.db import models, transaction
from django.db.models import F
from django.utils import timezone
from django.conf import settings
from airlines.models import Flight


class Ticket(models.Model):
    class Status(models.TextChoices):
        PAID = "paid", "Paid"
        REFUNDED = "refunded", "Refunded"
        CANCELED = "canceled", "Canceled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="tickets", db_index=True
    )
    flight = models.ForeignKey(
        Flight, on_delete=models.PROTECT, related_name="tickets", db_index=True
    )
    confirmation_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    price_paid = models.DecimalField(max_digits=10, decimal_places=2)
    booked_at = models.DateTimeField(auto_now_add=True)
    canceled_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PAID)

    class Meta:
        ordering = ("-booked_at",)
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["flight", "status"]),
        ]

    def __str__(self) -> str:
        return f"#{self.pk} {self.user} — {self.flight} ({self.status})"

    @staticmethod
    def purchase(user, flight: Flight) -> "Ticket":
        """Атомарная покупка билета с арендой строки рейса."""
        with transaction.atomic():
            f = Flight.objects.select_for_update().get(pk=flight.pk)
            if f.seats_available <= 0:
                raise ValueError("No seats available")
            # уменьшаем место
            Flight.objects.filter(pk=f.pk).update(seats_available=F("seats_available") - 1)
            # фиксируем цену покупки на момент транзакции
            return Ticket.objects.create(user=user, flight=f, price_paid=f.base_price)

    def can_refund(self) -> bool:
        """Разрешаем возврат, если до вылета ≥ 24 часа."""
        delta = self.flight.departure_at - timezone.now()
        return delta.total_seconds() >= 24 * 3600

    def cancel(self) -> None:
        """Отмена/возврат. Возвращает место если возврат."""
        if self.status != self.Status.PAID:
            return
        self.canceled_at = timezone.now()
        if self.can_refund():
            self.status = self.Status.REFUNDED
            Flight.objects.filter(pk=self.flight_id).update(
                seats_available=F("seats_available") + 1
            )
        else:
            self.status = self.Status.CANCELED
        self.save(update_fields=["status", "canceled_at"])
