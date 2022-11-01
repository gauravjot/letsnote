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