from rest_framework import serializers
from users.models import User, Verify, Session


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'verified',
                  'password', 'created', 'updated']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True},
            'created': {'write_only': True},
            'updated': {'write_only': True}
        }


class VerifySerializer(serializers.ModelSerializer):
    class Meta:
        model = Verify
        fields = ['id', 'user', 'token', 'created', 'consumed']
        extra_kwargs = {
            'user': {'required': True},
            'token': {'required': True},
        }


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'token', 'user', 'expire',
                  'valid', 'created', 'ip', 'ua']
        extra_kwargs = {
            'token': {'required': True, 'write_only': True},
            'user': {'required': True},
        }
