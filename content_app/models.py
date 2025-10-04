from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Banner(TimeStampedModel):
    title = models.CharField(max_length=120)
    image_url = models.URLField()
    link_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order", "id")

    def __str__(self) -> str:
        return f"{self.title} (#{self.pk})"


class Offer(TimeStampedModel):
    title = models.CharField(max_length=120)
    subtitle = models.CharField(max_length=200, blank=True)
    price_from = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order", "id")

    def __str__(self) -> str:
        return f"{self.title} (#{self.pk})"
