from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # Вся аутентификация под /api/auth/
    path("api/auth/", include("accounts.urls")),

    # Остальные приложения
    path("api/", include("airlines.urls")),
    path("api/", include("tickets.urls")),
    path("api/", include("content_app.urls")),
]
