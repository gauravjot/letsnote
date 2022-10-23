from django.db import models
from backend.policies import MAX_SIGNIN_PERIOD

# Create your models here.
class User(models.Model):
    id = models.UUIDField(primary_key=True)
    full_name = models.CharField(max_length=64)
    email = models.EmailField(max_length=256, unique=True)
    email_verified = models.BooleanField(default=False)
    password = models.CharField(max_length=72)
    created = models.DateTimeField()
    updated = models.DateTimeField()

    def __str__(self):
        return f"id:{self.pk}, {self.full_name}, {self.email} (verified: {self.email_verified})"

# Email Verifications
class Verify(models.Model):
    user = models.CharField(max_length=48)
    token = models.CharField(max_length=128)
    created = models.DateTimeField()
    consumed = models.BooleanField(default=False)

    def __str__(self):
        return f"id:{self.pk}, {self.user}, {self.created} (consumed: {self.consumed})"

# User sessions
class Session(models.Model):
    token = models.CharField(max_length=128)
    user = models.CharField(max_length=48)
    expire = models.IntegerField(default=MAX_SIGNIN_PERIOD)
    valid = models.BooleanField(default=True)
    created = models.DateTimeField()
    ip = models.GenericIPAddressField()
    ua = models.TextField()

    def __str__(self):
        return f"User: {self.user}, Session made: {self.created} by {self.ip}, Valid: {self.valid}"