from pathlib import Path
from decouple import config
from django.core.mail import get_connection


"""
#################################################################
#                                                               #
#                       DJANGO SETTINGS                         #
#             Possibly no need to change anything               #
#                      Edit .env instead                        #
#                                                               #
#################################################################
"""

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_BASE_DIR = BASE_DIR.parent

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
    config('FRONTEND_URL', default='http://localhost:5173'),
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


# Database
def get_database():
    if config('DB_HOST', default=None) is None:
        Path(str(BASE_DIR.parent) +
             "/db").mkdir(parents=True, exist_ok=True)
        return {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR.parent / 'db' / 'db.sqlite3',
            }
        }
    else:
        return {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': config('DB_NAME'),
                'USER': config('DB_USERNAME'),
                'PASSWORD': config('DB_PASSWORD'),
                'HOST': config('DB_HOST'),
                'PORT': config('DB_PORT'),
            }
        }


# If no database is provided, use sqlite3
DATABASES = get_database()


# Email

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"


def getEmailConnection():
    if config('SMTP_USE_TLS', default=True, cast=bool) == True:
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
