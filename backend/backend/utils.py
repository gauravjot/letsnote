# Security
import hashlib

def errorResponse(message, actionCode="A0"):
    return dict(action = "fail", message = [message], code = str(actionCode))

def successResponse():
    return dict(action = "success")

def tokenResponse(token):
    return dict(token = token)

def hashThis(value):
    return hashlib.sha256(str(value).encode('utf-8')).hexdigest()