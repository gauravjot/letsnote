# Security
import hashlib


def errorResponse(message, actionCode="A0"):
    return dict(success=False, message=message, code=str(actionCode))


def successResponse(payload=dict()):
    return dict(success=True, data=payload)


def tokenResponse(token):
    return dict(token=token)


def hashThis(value):
    return hashlib.sha256(str(value).encode('utf-8')).hexdigest()
