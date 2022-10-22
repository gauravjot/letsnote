from rest_framework import serializers
from instances.models import Session

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'token', 'user', 'expire', 'valid', 'created', 'ip', 'ua']