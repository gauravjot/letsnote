from rest_framework import serializers
from .models import Note, ShareExternal

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'user', 'title', 'content', 'created', 'updated']
        
class NoteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'user', 'title', 'created', 'updated']
        
class ShareExternalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShareExternal
        fields = ['id', 'title', 'created', 'anonymous']
        