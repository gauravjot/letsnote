import pytz
from datetime import datetime
# Security
from secrets import token_urlsafe
from backend.utils import hashThis
# Models & Serializers
from .serializers import SessionSerializer


# Get user id from request
def getUser(request):
    return request.active_session.user


def getSesson(request):
    return request.active_session


# Create a token
def issueToken(uid, request):
    newToken = token_urlsafe(48)
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
    session = request.active_session
    session.valid = False
    session.token = "dropped"
    session.expire = 0
    session.save()


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
