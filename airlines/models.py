from django.db import models
from django.conf import settings
from django.utils import timezone

class Company(models.Model):
    name = models.CharField(max_length=128, unique=True)
    code = models.CharField(max_length=8, unique=True)
    managers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='companies', blank=True)
    is_active = models.BooleanField(default=True)
    def __str__(self): return f"{self.code} — {self.name}"

class Flight(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Scheduled"
        COMPLETED = "completed", "Completed"
        CANCELED = "canceled", "Canceled"
    company = models.ForeignKey(Company, on_delete=models.PROTECT, related_name='flights')
    flight_no = models.CharField(max_length=10)
    origin = models.CharField(max_length=64)
    destination = models.CharField(max_length=64)
    departure_at = models.DateTimeField()
    arrival_at = models.DateTimeField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    seats_total = models.PositiveIntegerField(default=100)
    seats_available = models.PositiveIntegerField(default=100)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.SCHEDULED)
    class Meta:
        indexes = [models.Index(fields=['origin','destination','departure_at'])]
        unique_together = ('company','flight_no','departure_at')
    @property
    def is_upcoming(self): return self.departure_at > timezone.now()
    def __str__(self): return f"{self.company.code} {self.flight_no} {self.origin}->{self.destination}"
