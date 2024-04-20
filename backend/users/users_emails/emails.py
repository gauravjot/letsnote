from django.core.mail import send_mail
from .email_templates import welcomeEmailTemplate, emailChangedTemplate, passwordChangedTemplate, deleteAccountTemplate, passwordResetTemplate
from backend.settings import getEmailConnection
from decouple import config
from ..session import getClientIP, getUserAgent


def sendEmailVerification(email, name, token):
    # Send this token
    try:
        with getEmailConnection() as connection:
            subject = "Verify your email"
            url = f"{config('BASE_URL')}/api/user/verifyemail/{token}/"
            html_message = emailChangedTemplate(name, url)
            from_email = config('SMTP_DEFAULT_SEND_FROM')
            message = f"Hello {name},\n\nPlease verify your email by clicking the link below.\n\n{url}\n\nThank you,\nLetsnote Team"
            return send_mail(subject=subject,
                             message=message,
                             html_message=html_message,
                             from_email=from_email,
                             recipient_list=[email,],
                             connection=connection)
    except Exception as e:
        return 0


def sendWelcomeEmailVerification(name, email, token):
    # Send this token
    try:
        with getEmailConnection() as connection:
            subject = "Welcome to Letsnote"
            url = f"{config('BASE_URL')}/api/user/verifyemail/{token}/"
            html_message = welcomeEmailTemplate(name, url)
            message = f"Hello {name},\n\nWelcome to Letsnote. Please verify your email by clicking the link below.\n\n{url}\n\nThank you,\nLetsnote Team"
            from_email = config('SMTP_DEFAULT_SEND_FROM')
            return send_mail(subject=subject,
                             message=message,
                             html_message=html_message,
                             from_email=from_email,
                             recipient_list=[email,],
                             connection=connection)
    except Exception as e:
        return 0


def sendPasswordChangeEmail(request, name, email, when):
    # Send this token
    try:
        with getEmailConnection() as connection:
            subject = "Password Changed Successfully"
            html_message = passwordChangedTemplate(
                device=getUserAgent(request),
                name=name,
                when=when,
                who=getClientIP(request)
            )
            message = f"Hello {name},\n\nYour password was changed on {when}.\n\n IP Address: {getClientIP(request)}\nDevice: {getUserAgent(request)}.\n\nIf this was not you, please send us an email to \"contact@letsnote.io\".\n\nThank you,\nLetsnote Team"
            from_email = config('SMTP_DEFAULT_SEND_FROM')
            return send_mail(subject=subject,
                             message=message,
                             html_message=html_message,
                             from_email=from_email,
                             recipient_list=[email,],
                             connection=connection)
    except Exception as e:
        return 0


def sendPasswordResetEmail(email, name, token):
    # Send this token
    try:
        with getEmailConnection() as connection:
            subject = "Reset your password"
            url = f"{config('FRONTEND_URL')}/passwordreset/{token}/"
            html_message = passwordResetTemplate(name, url)
            message = f"Hello {name},\n\nPlease reset your password by clicking the link below.\n\n{url}\n\nThank you,\nLetsnote Team"
            from_email = config('SMTP_DEFAULT_SEND_FROM')
            return send_mail(subject=subject,
                             message=message,
                             html_message=html_message,
                             from_email=from_email,
                             recipient_list=[email,],
                             connection=connection)
    except Exception as e:
        return 0


def sendAccountDeletedEmail(request, name, email, when):
    # Send this token
    try:
        with getEmailConnection() as connection:
            subject = "Account Deleted Successfully"
            html_message = deleteAccountTemplate(
                name=name,
                who=getClientIP(request),
                when=when,
                device=getUserAgent(request),
            )
            message = f"Hello {name},\n\nYour account was deleted successfully on {when}.\n\n IP Address: {getClientIP(request)}\nDevice: {getUserAgent(request)}.\n\nIf this was not you, please send us an email to \"contact@letsnote.io\".\n\nThank you,\nLetsnote Team"
            from_email = config('SMTP_DEFAULT_SEND_FROM')
            return send_mail(subject=subject,
                             message=message,
                             html_message=html_message,
                             from_email=from_email,
                             recipient_list=[email,],
                             connection=connection)
    except Exception as e:
        return 0
