from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        USER = "USER", "User"
        COMPANY_MANAGER = "COMPANY_MANAGER", "Company Manager"
        ADMIN = "ADMIN", "Admin"

    role = models.CharField(max_length=32, choices=Role.choices, default=Role.USER)

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"
