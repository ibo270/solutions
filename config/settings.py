from pathlib import Path
import os
from datetime import timedelta
from dotenv import load_dotenv
from urllib.parse import urlparse
from os import getenv
import dj_database_url
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

CORS_ALLOWED_ORIGINS = [u for u in getenv("CORS_ALLOWED_ORIGINS", "").split(",") if u]
CSRF_TRUSTED_ORIGINS = [u for u in getenv("CSRF_TRUSTED_ORIGINS", "").split(",") if u]

ALLOWED_HOSTS = [u for u in getenv("ALLOWED_HOSTS", "").split(",") if u] or ["*"]
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret')
DEBUG = os.getenv('DEBUG', '1') == '1'
ALLOWED_HOSTS = [h for h in os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',') if h]

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django_filters',
    'accounts',
    'airlines',
    'tickets',
    'content_app',
    
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database via DATABASE_URL (supports sqlite:///db.sqlite3 by default)
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///db.sqlite3')
if DATABASE_URL.startswith('sqlite:///'):
    DB_NAME = DATABASE_URL.replace('sqlite:///', '')
    DATABASES = {
    "default": dj_database_url.parse(getenv("DATABASE_URL", "sqlite:///db.sqlite3"))
}
else:
    
    url = urlparse(DATABASE_URL)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': url.path.lstrip('/'),
            'USER': url.username,
            'PASSWORD': url.password,
            'HOST': url.hostname,
            'PORT': url.port or '',
        }
    }

AUTH_USER_MODEL = 'accounts.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 20,
}


JAZZMIN_SETTINGS = {
    "site_title": "Flight Tickets",
    "site_header": "Flight Tickets — Admin",
    "site_brand": "Flight Tickets",
    "welcome_sign": "Добро пожаловать 👋",
    "copyright":
        "© Flight Tickets, {year}",
    "search_model": ["accounts.User","airlines.Flight","tickets.Ticket"],
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "order_with_respect_to": ["airlines", "tickets", "accounts", "content_app"],
    "icons": {
        "accounts.User": "fas fa-user",
        "airlines.Company": "fas fa-building",
        "airlines.Flight": "fas fa-plane",
        "tickets.Ticket": "fas fa-ticket-alt",
        "content_app.Banner": "far fa-image",
        "content_app.Offer": "fas fa-bullhorn",
    },
    "topmenu_links": [
        {"name": "Главная админки", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "API Docs", "url": "/api/docs", "new_window": True},
    ],
    "usermenu_links": [
        {"name":"Профиль", "url":"admin:accounts_user_changelist"},
    ],
}
JAZZMIN_SETTINGS["show_ui_builder"] = True
JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": False,
    "accent": "accent-primary",
    "navbar": "navbar-dark",
    "no_navbar_border": False,
    "navbar_fixed": False,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "cyborg",
    "dark_mode_theme": "cyborg",
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    },
    "actions_sticky_top": True
}
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('ACCESS_TOKEN_LIFETIME_MIN', '60'))),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=int(os.getenv('REFRESH_TOKEN_LIFETIME_DAYS', '1'))),
}
INSTALLED_APPS += ["corsheaders"]
MIDDLEWARE = ["corsheaders.middleware.CorsMiddleware", *MIDDLEWARE]
CORS_ALLOWED_ORIGINS = ["http://127.0.0.1:5173","http://localhost:5173"]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT='/vol/web/static'
MEDIA_ROOT='/vol/web/media'
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
