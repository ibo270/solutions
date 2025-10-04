from django.contrib.auth import get_user_model, password_validation
from django.core import exceptions
from rest_framework import serializers

User = get_user_model()


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "role")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

    def validate_username(self, value: str):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value

    def validate_password(self, value: str):
        try:
            password_validation.validate_password(value)
        except exceptions.ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def to_representation(self, instance):
        # при ответе на регистрацию возвращаем публичное представление (без пароля)
        return UserMeSerializer(instance).data


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        user: User = self.context["request"].user
        if not user.check_password(attrs["old_password"]):
            raise serializers.ValidationError({"old_password": "Wrong password"})
        try:
            password_validation.validate_password(attrs["new_password"], user=user)
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})
        return attrs

    def save(self, **kwargs):
        user: User = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user
