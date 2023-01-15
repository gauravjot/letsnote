from django.db import models

# Create your models here.
class Note(models.Model):
    id = models.UUIDField(primary_key=True)
    user = models.CharField(max_length=48)
    title = models.CharField(max_length=100,default="Untitled")
    content = models.JSONField()
    created = models.DateTimeField()
    updated = models.DateTimeField()

    def __str__(self):
        return f"id:{self.pk}, {self.user}, {self.title}, {self.created}"
    
class ShareExternal(models.Model):
    id = models.UUIDField(primary_key=True)
    title = models.CharField(max_length=48,default="Link Share")
    key = models.CharField(max_length=72)
    noteid = models.CharField(max_length=48)
    expire = models.IntegerField(default=0)
    created = models.DateTimeField()
    creator = models.CharField(max_length=48)
    anonymous = models.BooleanField(default=True)
    
    def __str__(self):
        return f"id:{self.pk}, {self.creator}, {self.noteid}, {self.created}, {self.expire}"