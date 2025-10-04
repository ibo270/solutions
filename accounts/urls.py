from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import MeView, RegisterView  # если есть регистрация — добавь RegisterView

urlpatterns = [
    path("jwt/create/", TokenObtainPairView.as_view(), name="jwt-create"),
    path("jwt/refresh/", TokenRefreshView.as_view(), name="jwt-refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("auth/register/", RegisterView.as_view(), name="register"),   # POST {username,email?,password}
    # path("register/", RegisterView.as_view(), name="register"),  # опционально
]


