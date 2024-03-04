import pytz
import json
import uuid
from datetime import datetime
# Security
import bcrypt
from secrets import token_hex
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Models & Serializers
from .models import User, Verify, Session
from .serializers import UserSerializer, VerifySerializer, SessionSerializer
# Session
from .session import issueToken, dropSession, getUserID
from backend.utils import tokenResponse, errorResponse, successResponse, hashThis


# Sign Up function
# -----------------------------------------------
@api_view(['POST'])
def register(request):
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
        verifyToken = token_hex(24)

        verifySerializer = VerifySerializer(data=dict(
            user=userSerializer.data['id'],
            token=hashThis(verifyToken),
            created=dateStamp
        ))
        if verifySerializer.is_valid():
            verifySerializer.save()
            emailSent = sendEmailVerification(
                userSerializer.data['id'], userSerializer.data['email'], verifyToken)
        # send token to user
        token, session_id, expire = issueToken(
            userSerializer.data['id'], request)
        response = Response(data=successResponse({"verifyEmailSent": emailSent, "user": userSerializer.data,
                            **tokenResponse(token), **dict(session=session_id)}), status=status.HTTP_201_CREATED)
        response.set_cookie(
            key='auth',
            value=token,
            expires=expire,
            secure=True,
            httponly=True,
            samesite='Strict'
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
        user).data, **tokenResponse(token), **dict(session=session_id)}), status=status.HTTP_202_ACCEPTED)
    response.set_cookie(
        key='auth',
        value=token,
        expires=expire,
        secure=True,
        httponly=True,
        samesite='Strict',
        domain='.letsnote.io'
    )
    return response


# Log Out function, requires token
# -----------------------------------------------
@api_view(['DELETE'])
def logout(request):
    # Invalidate the token
    dropSession(request)
    return Response(data=successResponse(), status=status.HTTP_200_OK)


# Verify Email, requires email verification token
# -----------------------------------------------
@api_view(['PUT'])
def verifyEmail(request, emailtoken):
    try:
        verify = Verify.objects.get(token=hashThis(emailtoken))
        if not verify.consumed:
            user = User.objects.get(uuid=verify.user)
            user.verified = True
            user.save()

            verify.consumed = True
            verify.save()

            return Response(data=successResponse(), status=status.HTTP_200_OK)
        return Response(data=errorResponse("Email verification failed. Resend verification email.", "A0007"), status=status.HTTP_400_BAD_REQUEST)
    except (User.DoesNotExist, Verify.DoesNotExist) as err:
        return Response(data=errorResponse("Email verification failed. Resend verification email.", "A0008"), status=status.HTTP_400_BAD_REQUEST)


# Change Password, requires old password and new password
# -----------------------------------------------
@api_view(['PUT'])
def changePassword(request):
    user = getUserID(request)
    if type(user) is Response:
        return user
    if not request.data['old_password'] or not request.data['new_password']:
        return Response(data=errorResponse("Old password and new password are required.", "A0010"), status=status.HTTP_400_BAD_REQUEST)
    if bcrypt.checkpw(request.data['old_password'].encode('utf-8'), user.password.encode('utf-8')):
        user.password = hashPwd(request.data['new_password'])
        user.password_updated = datetime.now(pytz.utc)
        user.save()
        return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)
    return Response(data=errorResponse("Credentials are incorrect.", "A0011"), status=status.HTTP_400_BAD_REQUEST)


# Change Name, requires new name
# -----------------------------------------------
@api_view(['PUT'])
def changeName(request):
    user = getUserID(request)
    if type(user) is Response:
        return user
    if not request.data['name']:
        return Response(data=errorResponse("Name is required.", "A0012"), status=status.HTTP_400_BAD_REQUEST)
    user.name = request.data['name']
    user.updated = datetime.now(pytz.utc)
    user.save()
    return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)


# Change Email, requires new email
# -----------------------------------------------
@api_view(['PUT'])
def changeEmail(request):
    user = getUserID(request)
    if type(user) is Response:
        return user
    if not request.data['email']:
        return Response(data=errorResponse("Email is required.", "A0013"), status=status.HTTP_400_BAD_REQUEST)
    user.email = request.data['email']
    user.updated = datetime.now(pytz.utc)
    user.save()
    return Response(data=successResponse(UserSerializer(user).data), status=status.HTTP_200_OK)


# Get User Sessions, requires token
# -----------------------------------------------
@api_view(['GET'])
def getUserSessions(request):
    user = getUserID(request)
    if type(user) is Response:
        return user
    sessionSerializer = SessionSerializer(
        Session.objects.filter(user=user, valid=True), many=True)
    return Response(data=successResponse(sessionSerializer.data), status=status.HTTP_200_OK)


# Delete User, requires password
# -----------------------------------------------
@api_view(['PUT'])
def deleteUser(request):
    user = getUserID(request)
    if type(user) is Response:
        return user
    if request.data['password'] and bcrypt.checkpw(request.data['password'].encode('utf-8'), user.password.encode('utf-8')):
        user.delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    return Response(data=errorResponse("Credentials are incorrect.", "A0015"), status=status.HTTP_400_BAD_REQUEST)


# Close Session, requires session_id
# -----------------------------------------------
@api_view(['PUT'])
def closeSession(request):
    user = getUserID(request)
    if type(user) is Response:
        return user
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
def sendEmailVerification(uuid, email, token):
    # Send this token
    return False


# Helper Functions
# -----------------------------------------------
def hashPwd(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
