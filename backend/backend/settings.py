from pathlib import Path
from decouple import config
from django.core.mail import get_connection

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)


# Application definition

INSTALLED_APPS = [
    'users',
    'notes',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',

    'users.middleware.AuthMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

REST_FRAMEWORK = {
    'UNAUTHENTICATED_USER': None,  # Needed once you disable django.contrib.auth
}

# CORS
# https://github.com/adamchainz/django-cors-headers

ALLOWED_HOSTS = ['*']

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://letsnote.io",
    "https://www.letsnote.io",
    "https://api.letsnote.io"
]

CORS_ALLOW_METHODS = (
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
)

CORS_ALLOW_HEADERS = (
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
)

CORS_ALLOW_CREDENTIALS = True

# Security
# https://django-secure.readthedocs.io/en/latest/middleware.html


CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=True, cast=bool)
SECURE_FRAME_DENY = False

NON_AUTH_URLS = [
    '/api/user/register/',
    '/api/user/login/',
    '/api/user/password/forgot/',
    '/api/user/password/reset/health/',
    '/api/user/password/reset/',
    '/api/user/verifyemail/resend/',
    '/api/user/verifyemail/',
]

# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USERNAME'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    }
}


# Email

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"


def getEmailConnection():
    if config('SMTP_USE_TLS') == 'True':
        return get_connection(
            host=config('SMTP_HOST'),
            port=config('SMTP_PORT'),
            username=config('SMTP_USER'),
            password=config('SMTP_PASSWORD'),
            use_tls=True,
        )
    else:
        return get_connection(
            host=config('SMTP_HOST'),
            port=config('SMTP_PORT'),
            username=config('SMTP_USER'),
            password=config('SMTP_PASSWORD'),
            use_ssl=True,
        )


# Internationalization

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = False

USE_TZ = True


# Default primary key field type

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
