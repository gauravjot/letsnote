import pytz
import uuid
import re
from datetime import datetime, timedelta
# Security
import bcrypt
from secrets import token_urlsafe
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .permissions import HasSessionActive
# Models & Serializers
from .models import User, Verify, Session, PasswordReset
from .serializers import UserSerializer, VerifySerializer, SessionSerializer, PasswordResetSerializer
# Session
from .session import issueToken, dropSession, getUser, getSesson
# Utils
from django.shortcuts import render
from .emails import sendEmailVerification, sendWelcomeEmailVerification, sendPasswordChangeEmail, sendPasswordResetEmail, sendAccountDeletedEmail
from backend.utils import errorResponse, successResponse, hashThis
from decouple import config


# Sign Up function
# -----------------------------------------------
@api_view(['POST'])
def register(request):
    if 'name' not in request.data or 'email' not in request.data or 'password' not in request.data:
        return Response(data=errorResponse("Name, email and password are required.", "A0031"), status=status.HTTP_400_BAD_REQUEST)
    # -- user data & hash password
    dateStamp = datetime.now(pytz.utc)

    userSerializer = UserSerializer(data=dict(
        id=uuid.uuid4(),
        name=str(request.data['name']),
        email=str(request.data['email']).lower(),
        password=hashPwd(str(request.data['password'])),
        created=dateStamp,
        updated=dateStamp,
        password_updated=dateStamp
    ))

    # -- check if data is without bad actors
    if userSerializer.is_valid():
        userSerializer.save()

        # Generate and send email verification token
        emailSent = False
        verifyToken = token_urlsafe(42)

        verifySerializer = VerifySerializer(data=dict(
            user=userSerializer.data['id'],
            token=hashThis(verifyToken),
            created=dateStamp
        ))
        if verifySerializer.is_valid():
            verifySerializer.save()
            emailSent = sendWelcomeEmailVerification(userSerializer.data['name'],
                                                     userSerializer.data['email'],
                                                     verifyToken)
        # send token to user
        token, session_id, expire = issueToken(
            userSerializer.data['id'], request)
        response = Response(
            data=successResponse(
                {"verifyEmailSent": True if emailSent == 1 else False,
                 "user": userSerializer.data,
                 **dict(session=session_id)}
            ),
            status=status.HTTP_201_CREATED
        )
        # expire is in minutes so we multiply by 60
        response.set_cookie(
            key='auth_ln',
            value=token,
            expires=expire*60,
            httponly=True,
            secure=config('AUTH_COOKIE_SECURE', default=True, cast=bool),
            samesite=config('AUTH_COOKIE_SAMESITE', default='Strict'),
            domain=config('AUTH_COOKIE_DOMAIN', default='localhost')
        )
        return response
    else:
        res_string = ""
        for key in userSerializer.errors:
            if key == 'email':
                res_string += f"Email: {userSerializer.errors[key][0]}\n"
            elif key == 'password':
                res_string += f"Password: {userSerializer.errors[key][0]}\n"
            elif key == 'name':
                res_string += f"Name: {userSerializer.errors[key][0]}\n"
            else:
                res_string += f"{key}: {userSerializer.errors[key][0]}\n"
        return Response(data=errorResponse(res_string, "A0001"), status=status.HTTP_400_BAD_REQUEST)


# Log In function, requires email and password
# -----------------------------------------------
@api_view(['POST'])
def login(request):
    email = str(request.data['email']).lower()
    password = str(request.data['password'])

    # Check if credentials are correct
    try:
        user = User.objects.get(email=email)
        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')) == False:
            return Response(data=errorResponse("Credentials are invalid.", "A0004"), status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response(data=errorResponse("Credentials are invalid.", "A0004"), status=status.HTTP_401_UNAUTHORIZED)
    # send token to user
    token, session_id, expire = issueToken(user.id, request)
    response = Response(data=successResponse({"user": UserSerializer(
        user).data, **dict(session=session_id)}), status=status.HTTP_202_ACCEPTED)
    # expire is in minutes so we multiply by 60
    response.set_cookie(
        key='auth_ln',
        value=token,
        expires=expire*60,
        httponly=True,
        secure=config('AUTH_COOKIE_SECURE', default=True, cast=bool),
        samesite=config('AUTH_COOKIE_SAMESITE', default='Strict'),
        domain=config('AUTH_COOKIE_DOMAIN', default='localhost')
    )
    return response


# Log Out function, requires token
# -----------------------------------------------
@api_view(['DELETE'])
@permission_classes([HasSessionActive])
def logout(request):
    # Invalidate the token
    dropSession(request)
    response = Response(data=successResponse(), status=status.HTTP_200_OK)
    response.delete_cookie(
        key='auth_ln',
        domain=config('AUTH_COOKIE_DOMAIN', default='localhost')
    )
    return response


# Verify Email, requires email verification token
# -----------------------------------------------
def verifyEmail(request, emailtoken):
    template = 'email_verification.html'
    try:
        verify = Verify.objects.get(token=hashThis(emailtoken))
        if not verify.consumed:
            user = User.objects.get(id=verify.user.id)
            user.verified = True
            user.save()

            verify.consumed = True
            verify.save()
            return render(request, template, {"verified": True, "url": config('FRONTEND_URL')})
        else:
            user = User.objects.get(id=verify.user.id)
            if user.verified:
                return render(request, template, {"verified": True, "url": config('FRONTEND_URL')})
        return render(request, template, {"verified": False, "url": config('FRONTEND_URL')})
    except (User.DoesNotExist, Verify.DoesNotExist) as err:
        return render(request, template, {"verified": False, "url": config('FRONTEND_URL')})


# Get User Profile, requires token
# -----------------------------------------------
@api_view(['GET'])
@permission_classes([HasSessionActive])
def getUserProfile(request):
    session = getSesson(request)
    return Response(data=successResponse({"user": UserSerializer(
        session.user).data, **dict(session=session.id)}), status=status.HTTP_202_ACCEPTED)


# Change Password, requires old password and new password
# -----------------------------------------------
@api_view(['PUT'])
@permission_classes([HasSessionActive])
def changePassword(request):
    session = getSesson(request)
    user = session.user
    if 'old_password' not in request.data or 'new_password' not in request.data:
        return Response(data=errorResponse("Old password and new password are required.", "A0010"), status=status.HTTP_400_BAD_REQUEST)
    if bcrypt.checkpw(request.data['old_password'].encode('utf-8'), user.password.encode('utf-8')):
        when = datetime.now(pytz.utc)
        user.password = hashPwd(request.data['new_password'])
        user.password_updated = when
        user.save()
        # Disabe all sessions except current
        Session.objects.filter(user=user, valid=True).exclude(
            id=session.id).update(valid=False)
        sendPasswordChangeEmail(request, user.name, user.email, when.ctime())
        return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)
    return Response(data=errorResponse("Credentials are incorrect.", "A0011"), status=status.HTTP_400_BAD_REQUEST)


# Change Name, requires new name
# -----------------------------------------------
@api_view(['PUT'])
@permission_classes([HasSessionActive])
def changeName(request):
    user = getUser(request)
    if 'name' not in request.data:
        return Response(data=errorResponse("Name is required.", "A0012"), status=status.HTTP_400_BAD_REQUEST)
    user.name = request.data['name']
    user.updated = datetime.now(pytz.utc)
    user.save()
    return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)


# Change Email, requires new email, password
# -----------------------------------------------
@api_view(['PUT'])
@permission_classes([HasSessionActive])
def changeEmail(request):
    user = getUser(request)
    # Check if email is not empty
    if 'email' not in request.data:
        return Response(data=errorResponse("Email is required.", "A0013"), status=status.HTTP_400_BAD_REQUEST)
    if 'password' not in request.data:
        return Response(data=errorResponse("Password is required.", "A0013"), status=status.HTTP_400_BAD_REQUEST)
    # Check if it valid email
    if not re.match(r"^\S+@\S+\.\S+$", request.data['email'].strip()):
        return Response(data=errorResponse("Email is invalid.", "A0017"), status=status.HTTP_400_BAD_REQUEST)
    # Check if password is correct
    if not bcrypt.checkpw(request.data['password'].encode('utf-8'), user.password.encode('utf-8')):
        return Response(data=errorResponse("Password is incorrect.", "A0030"), status=status.HTTP_400_BAD_REQUEST)
    # Check if email is not the same
    if user.email == request.data['email'].strip():
        return Response(data=errorResponse("New email is the same.", "A0018"), status=status.HTTP_400_BAD_REQUEST)
    # Check if email is not in use
    if User.objects.filter(email=request.data['email'].strip()).exists():
        return Response(data=errorResponse("Email is already in use.", "A0016"), status=status.HTTP_400_BAD_REQUEST)

    # Update email
    user.email = request.data['email'].strip()
    user.verified = False
    user.updated = datetime.now(pytz.utc)
    user.save()

    # Generate and send email verification token
    emailSent = 0
    verifyToken = token_urlsafe(42)

    verifySerializer = VerifySerializer(data=dict(
        user=user.id,
        token=hashThis(verifyToken),
        created=datetime.now(pytz.utc)
    ))
    if verifySerializer.is_valid():
        # Delete previous verification tokens
        Verify.objects.filter(user=user, consumed=False).delete()
        # Save new
        verifySerializer.save()
        emailSent = sendEmailVerification(
            request.data['email'], user.name, verifyToken)

    return Response(data=successResponse({"verifyEmailSent": True if emailSent == 1 else False,
                                          "user": UserSerializer(user).data}), status=status.HTTP_200_OK)


# Resend Verification Email if user is unverified
# -----------------------------------------------
@api_view(['POST'])
@permission_classes([HasSessionActive])
def resendVerifyEmail(request):
    user = getUser(request)
    if user.verified:
        return Response(data=errorResponse("Email is already verified.", "A0019"), status=status.HTTP_400_BAD_REQUEST)

    # Check if last email was sent atleast 10 mins ago
    lastEmail = Verify.objects.filter(
        user=user, consumed=False).order_by('-created').first()
    if lastEmail and lastEmail.created + timedelta(minutes=10) > datetime.now(pytz.utc):
        return Response(data=errorResponse("Email was sent less than 10 minutes ago. Please try again later.", "A0021"), status=status.HTTP_400_BAD_REQUEST)

    # Generate and send email verification token
    emailSent = 0
    verifyToken = token_urlsafe(42)

    verifySerializer = VerifySerializer(data=dict(
        user=user.id,
        token=hashThis(verifyToken),
        created=datetime.now(pytz.utc)
    ))
    if verifySerializer.is_valid():
        # Disable previous verification tokens
        Verify.objects.filter(user=user, consumed=False).update(consumed=True)
        # Save new
        verifySerializer.save()
        # Send email
        emailSent = sendEmailVerification(
            user.email, user.name, verifyToken)
    return Response(data=successResponse() if emailSent == 1 else errorResponse("Failed to send the verification email. Please try again or contact support.", "A0020"),
                    status=status.HTTP_200_OK)


# Request Reset Password, requires email
# -----------------------------------------------
@api_view(['POST'])
def forgotPassword(request):
    if 'email' not in request.data:
        return Response(data=errorResponse("Email is required.", "A0025"), status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=request.data['email'])
        # Generate and send email verification token
        emailSent = 0
        resetToken = token_urlsafe(42)

        resetSerializer = PasswordResetSerializer(data=dict(
            user=user.id,
            token=hashThis(resetToken),
            created=datetime.now(pytz.utc)
        ))
        if resetSerializer.is_valid():
            # Disable previous tokens
            PasswordReset.objects.filter(
                user=user, consumed=False).update(consumed=True)
            # Save new
            resetSerializer.save()
            # Send email
            emailSent = sendPasswordResetEmail(
                user.email, user.name, resetToken)
        return Response(data=successResponse() if emailSent == 1 else errorResponse("Failed to send the reset email. Please try again or contact support.", "A0024"),
                        status=status.HTTP_200_OK if emailSent == 1 else status.HTTP_500_INTERNAL_SERVER_ERROR)
    except User.DoesNotExist:
        # Send success response even if email is not found to prevent email enumeration
        return Response(data=successResponse(), status=status.HTTP_200_OK)


# Reset Password from Token, result of Forgot Password
# requires password and token
# ----------------------------------------------------
@api_view(['POST'])
def resetPasswordFromToken(request):
    if 'password' not in request.data:
        return Response(data=errorResponse("Password is required.", "A0026"), status=status.HTTP_400_BAD_REQUEST)
    if 'token' not in request.data:
        return Response(data=errorResponse("URL is expired or token is invalid.", "A0032"), status=status.HTTP_400_BAD_REQUEST)
    try:
        reset = PasswordReset.objects.get(
            token=hashThis(request.data['token']))
        # Check if created is 24hrs old
        if reset.created + timedelta(hours=24) < datetime.now(pytz.utc):
            if not reset.consumed:
                reset.consumed = True
                reset.token = "expired_before_use"
                reset.save()
            return Response(data=errorResponse("Token is expired. Please try reseting password again.", "A0027"), status=status.HTTP_400_BAD_REQUEST)
        # Check if token is not consumed
        if not reset.consumed:
            user = User.objects.get(id=reset.user.id)
            user.password = hashPwd(request.data['password'])
            user.password_updated = datetime.now(pytz.utc)
            user.save()

            reset.consumed = True
            reset.save()

            # Disabe all sessions
            Session.objects.filter(user=user, valid=True).update(valid=False)

            return Response(data=successResponse(), status=status.HTTP_200_OK)
        return Response(data=errorResponse("Token is already consumed.", "A0028"), status=status.HTTP_400_BAD_REQUEST)
    except (User.DoesNotExist, PasswordReset.DoesNotExist):
        return Response(data=errorResponse("Token is invalid.", "A0029"), status=status.HTTP_400_BAD_REQUEST)


# Check if Password Reset Token is valid
# -----------------------------------------------
@api_view(['GET'])
def passwordResetTokenHealthCheck(request, token):
    try:
        reset = PasswordReset.objects.get(token=hashThis(token))
        if reset.created + timedelta(hours=24) < datetime.now(pytz.utc):
            if not reset.consumed:
                reset.consumed = True
                reset.token = "expired_before_use"
                reset.save()
            return Response(data=errorResponse("Token is invalid. Please try reseting password again.", "A0033"), status=status.HTTP_400_BAD_REQUEST)
        if not reset.consumed:
            return Response(data=successResponse(), status=status.HTTP_200_OK)
        return Response(data=errorResponse("Token is already consumed.", "A0033"), status=status.HTTP_400_BAD_REQUEST)
    except PasswordReset.DoesNotExist:
        return Response(data=errorResponse("Token is invalid. Please try reseting password again.", "A0034"), status=status.HTTP_400_BAD_REQUEST)


# Get User Sessions, requires token
# -----------------------------------------------
@api_view(['GET'])
@permission_classes([HasSessionActive])
def getUserSessions(request):
    user = getUser(request)
    sessionSerializer = SessionSerializer(
        Session.objects.filter(user=user, valid=True), many=True)
    return Response(data=successResponse(sessionSerializer.data), status=status.HTTP_200_OK)


# Delete User, requires password
# -----------------------------------------------
@api_view(['PUT'])
@permission_classes([HasSessionActive])
def deleteUser(request):
    user = getUser(request)
    if 'password' in request.data and bcrypt.checkpw(request.data['password'].encode('utf-8'), user.password.encode('utf-8')):
        sendAccountDeletedEmail(
            request, user.name, user.email, datetime.now(pytz.utc).ctime())
        user.delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    return Response(data=errorResponse("Credentials are incorrect.", "A0015"), status=status.HTTP_400_BAD_REQUEST)


# Close Session, requires session_id
# -----------------------------------------------
@api_view(['PUT'])
@permission_classes([HasSessionActive])
def closeSession(request):
    user = getUser(request)
    try:
        session = Session.objects.get(
            user=user,
            valid=True,
            id=request.data['session_id']
        )
        session.valid = False
        session.token = "dropped"
        session.expire = 0
        session.save()
    except Session.DoesNotExist:
        return Response(data=errorResponse("Session not found.", "A0014"), status=status.HTTP_400_BAD_REQUEST)
    return Response(data=successResponse(), status=status.HTTP_200_OK)


# Services
# -----------------------------------------------


# Helper Functions
# -----------------------------------------------
def hashPwd(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
