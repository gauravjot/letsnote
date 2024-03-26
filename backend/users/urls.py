from django.urls import path
from .views import *

urlpatterns = [
    path('api/user/register/', register),
    path('api/user/login/', login),
    path('api/user/logout/', logout),
    path('api/user/password/forgot/', forgotPassword),
    path('api/user/password/reset/', resetPasswordFromToken),
    path('api/user/password/reset/health/<token>/',
         passwordResetTokenHealthCheck),
    path('api/user/profile/', getUserProfile),
    path('api/user/change/password/', changePassword),
    path('api/user/change/name/', changeName),
    path('api/user/change/email/', changeEmail),
    path('api/user/sessions/', getUserSessions),
    path('api/user/session/close/', closeSession),
    path('api/user/delete/', deleteUser),
    path('api/user/verifyemail/resend/', resendVerifyEmail),
    path('api/user/verifyemail/<emailtoken>/', verifyEmail),
]
