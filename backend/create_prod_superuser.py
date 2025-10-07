#!/usr/bin/env python
import os
import sys
import django

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_prod_superuser():
    """Создает супер админа для продакшена"""
    username = 'admin'
    email = 'admin@example.com'
    password = 'admin123'
    
    try:
        # Пытаемся найти существующего пользователя
        user = User.objects.get(username=username)
        print(f"Пользователь {username} уже существует. Обновляем пароль...")
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()
        print(f"Пароль для {username} обновлен: {password}")
    except User.DoesNotExist:
        # Создаем нового пользователя
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print(f"Создан новый супер админ: {username} / {password}")
    
    print(f"\nДанные для входа в админ панель:")
    print(f"URL: https://flying-tickets-backend-r7jgzdkqma-uc.a.run.app/admin/")
    print(f"Логин: {username}")
    print(f"Пароль: {password}")

if __name__ == '__main__':
    create_prod_superuser()




