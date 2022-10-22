from django.db import models
from policies import MAX_SIGNIN_PERIOD
import uuid

# Create your models here.
class Session(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4())
    token = models.CharField(max_length=128, editable=False)
    user = models.CharField(max_length=48, editable=False)
    expire = models.IntegerField(default=MAX_SIGNIN_PERIOD, editable=False)
    valid = models.BooleanField(default=True)
    created = models.DateTimeField(editable=False)
    ip = models.GenericIPAddressField(editable=False)
    ua = models.TextField(editable=False)

    def __str__(self):
        return f"User: {self.user}, Session made: {self.created} by {self.ip}, Valid: {self.valid}"