import pytz
from datetime import datetime, timedelta
# Security
from secrets import token_hex
# RestFramework
from rest_framework.response import Response
from rest_framework import status

# Models & Serializers
from .models import Session
from .serializers import SessionSerializer

from backend.utils import errorResponse, hashThis

# Get user id from request


def getUserID(request):
    # Check if token in present in cookie
    try:
        token = request.COOKIES['auth']
        if len(token) < 48:
            raise KeyError
    except KeyError:
        # Check if token is present in header
        try:
            token = request.headers['Authorization'].split()[-1]
            if len(token) < 48:
                raise KeyError
            pass
        except KeyError:
            return Response(errorResponse("Unauthorized.", "A1001"), status=status.HTTP_401_UNAUTHORIZED)
        if len(token) < 48:
            return Response(errorResponse("Unauthorized.", "A1001"), status=status.HTTP_401_UNAUTHORIZED)

    # Check if token is present in database and is valid
    try:
        session = Session.objects.select_related(
            'user').get(token=hashThis(token))
        # Check if session is expired
        isSessionExpired = False
        gap = datetime.now(tz=pytz.utc) - session.created
        if gap > timedelta(minutes=session.expire):
            isSessionExpired = True
        # Return valid token
        if session.valid and not isSessionExpired:
            return session.user
        else:
            if session.valid:
                session.valid = False
                session.token = "expired"
                session.save()
            return Response(errorResponse("Unauthorized.", "A1002"), status=status.HTTP_401_UNAUTHORIZED)
    except Session.DoesNotExist:
        return Response(errorResponse("Unauthorized.", "A1003"), status=status.HTTP_401_UNAUTHORIZED)


def getSesson(request):
    # Check if token in present in cookie
    try:
        token = request.COOKIES['auth']
        if len(token) < 48:
            raise KeyError
    except KeyError:
        # Check if token is present in header
        try:
            token = request.headers['Authorization'].split()[-1]
            if len(token) < 48:
                raise KeyError
            pass
        except KeyError:
            return Response(errorResponse("Unauthorized.", "A1001"), status=status.HTTP_401_UNAUTHORIZED)
        if len(token) < 48:
            return Response(errorResponse("Unauthorized.", "A1001"), status=status.HTTP_401_UNAUTHORIZED)

    try:
        session = Session.objects.select_related(
            'user').get(token=hashThis(token))
        # Check if session is expired
        isSessionExpired = False
        gap = datetime.now(tz=pytz.utc) - session.created
        if gap > timedelta(minutes=session.expire):
            isSessionExpired = True
        if session.valid and not isSessionExpired:
            return session.id
    except Session.DoesNotExist:
        return ""

# Create a token


def issueToken(uid, request):
    newToken = token_hex(24)
    sessionSerializer = SessionSerializer(data=dict(
        token=hashThis(newToken),
        user=uid,
        created=datetime.now(pytz.utc),
        ip=getClientIP(request),
        ua=getUserAgent(request)
    ))
    if sessionSerializer.is_valid():
        sessionSerializer.save()
        return newToken, sessionSerializer.data.get('id'), sessionSerializer.data.get('expire')

# Invalidate a token


def dropSession(request):
    try:
        token = request.COOKIES['auth']
        if len(token) < 48:
            raise KeyError
    except KeyError:
        # Check if token is present in header
        try:
            token = request.headers['Authorization'].split()[-1]
            if len(token) < 48:
                raise KeyError
            pass
        except KeyError:
            return Response(errorResponse("Unauthorized.", "A1001"), status=status.HTTP_401_UNAUTHORIZED)
        if len(token) < 48:
            return Response(errorResponse("Unauthorized.", "A1001"), status=status.HTTP_401_UNAUTHORIZED)
    if len(token) >= 48:
        try:
            session = Session.objects.get(token=hashThis(token))
            session.valid = False
            session.token = "dropped"
            session.expire = 0
            session.save()
        except Session.DoesNotExist:
            pass

# Get Client IP Address


def getClientIP(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

# Get User Agent


def getUserAgent(request):
    return request.META.get('HTTP_USER_AGENT')
