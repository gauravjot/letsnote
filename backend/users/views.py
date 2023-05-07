import pytz, json, uuid
from datetime import datetime
# Security
import bcrypt
from secrets import token_hex
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Models & Serializers
from .models import User, Verify
from .serializers import UserSerializer, VerifySerializer
# Session
from .session import issueToken, dropSession
from backend.utils import tokenResponse, errorResponse, successResponse, hashThis

# Sign Up function
# -----------------------------------------------
@api_view(['POST'])
def register(request):
    # -- user data & hash password
    dateStamp = datetime.now(pytz.utc)

    userSerializer = UserSerializer(data=dict(
        id = uuid.uuid4(),
        name = str(request.data['name']),
        email = str(request.data['email']).lower(),
        password = hashPwd(str(request.data['password'])),
        created = dateStamp,
        updated = dateStamp
    ))

    # -- check if data is without bad actors
    if userSerializer.is_valid():
        userSerializer.save()

        # Generate and send email verification token
        emailSent = False
        verifyToken = token_hex(24)

        verifySerializer = VerifySerializer(data=dict(
            user = userSerializer.data['id'],
            token = hashThis(verifyToken),
            created = dateStamp
        ))
        if verifySerializer.is_valid():
            verifySerializer.save()
            emailSent = sendEmailVerification(userSerializer.data['id'], userSerializer.data['email'], verifyToken)
        # send token to user
        token = issueToken(userSerializer.data['id'], request)
        return Response(data=successResponse({"verifyEmailSent":emailSent,"user":userSerializer.data,**tokenResponse(token)}),status=status.HTTP_201_CREATED)
    else:
        return Response(data=errorResponse(userSerializer.errors),status=status.HTTP_400_BAD_REQUEST)

# Log In function, requires email and password
# -----------------------------------------------
@api_view(['POST'])
def login(request):
    email = str(request.data['email']).lower()
    password = str(request.data['password'])

    # Check if credentials are correct
    try:
        user = User.objects.get(email=email)
        if bcrypt.checkpw(password.encode('utf-8'),user.password.encode('utf-8')) == False:
            return Response(data=errorResponse("Error: A0004. Credentials are invalid.", "A0004"),status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response(data=errorResponse("Error: A0004. Credentials are invalid.", "A0004"),status=status.HTTP_401_UNAUTHORIZED)
    # send token to user
    token = issueToken(user.id, request)
    return Response(data=successResponse({"user":UserSerializer(user).data, **tokenResponse(token)}),status=status.HTTP_202_ACCEPTED)

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

            return Response(data=successResponse(),status=status.HTTP_200_OK)
        return Response(data=errorResponse("Email verification failed. Resend verification email.", "A0007"),status=status.HTTP_400_BAD_REQUEST)
    except (User.DoesNotExist, Verify.DoesNotExist) as err:
        return Response(data=errorResponse("Email verification failed. Resend verification email.", "A0008"),status=status.HTTP_400_BAD_REQUEST)

# Services
# -----------------------------------------------
def sendEmailVerification(uuid, email, token):
    # Send this token
    return False


# Helper Functions
# -----------------------------------------------

def hashPwd(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')