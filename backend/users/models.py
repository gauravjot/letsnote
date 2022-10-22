from django.db import models
import uuid

# Create your models here.
class User(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4())
    full_name = models.CharField(max_length=64)
    email = models.EmailField(max_length=256, unique=True)
    email_verified = models.BooleanField(default=False)
    password = models.CharField(max_length=72)
    created = models.DateTimeField(editable=False)
    updated = models.DateTimeField()

    def __str__(self):
        return f"id:{self.pk}, {self.full_name}, {self.email} (verified: {self.email_verified})"
    
class Verify(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4())
    user = models.CharField(max_length=48, editable=False)
    token = models.CharField(max_length=128, editable=False)
    created = models.DateTimeField(editable=False)
    consumed = models.BooleanField(default=False)

    def __str__(self):
        return f"id:{self.pk}, {self.user}, {self.created} (consumed: {self.consumed})"