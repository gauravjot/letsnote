from django.db import models
from backend.policies import MAX_SIGNIN_PERIOD


class User(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=64)
    email = models.EmailField(max_length=256, unique=True)
    verified = models.BooleanField(default=False)
    password = models.CharField(max_length=72)
    created = models.DateTimeField()
    updated = models.DateTimeField()
    password_updated = models.DateTimeField()

    def __str__(self):
        return f"id:{self.pk}, {self.name}, {self.email} (verified: {self.verified})"


class Verify(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=64)
    created = models.DateTimeField()
    consumed = models.BooleanField(default=False)

    def __str__(self):
        return f"id:{self.pk}, {self.user}, {self.created} (consumed: {self.consumed})"


class Session(models.Model):
    token = models.CharField(max_length=64)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expire = models.IntegerField(default=MAX_SIGNIN_PERIOD)
    valid = models.BooleanField(default=True)
    created = models.DateTimeField()
    ip = models.GenericIPAddressField()
    ua = models.TextField()

    def __str__(self):
        return f"User: {self.user}, Session made: {self.created} by {self.ip}, Valid: {self.valid}"


class PasswordReset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=64)
    created = models.DateTimeField()
    consumed = models.BooleanField(default=False)

    def __str__(self):
        return f"id:{self.pk}, {self.user}, {self.created} (consumed: {self.consumed})"
