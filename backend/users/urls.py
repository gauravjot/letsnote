from django.urls import path
from .views import register, login, logout, verifyEmail

urlpatterns = [
    path('api/user/register/', register),
    path('api/user/login/', login),
    path('api/user/logout/', logout),
    path('api/user/verifyemail/<emailtoken>/', verifyEmail),
]