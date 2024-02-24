from rest_framework import serializers
from users.models import User, Verify, Session


class PublicUserSerializer(serializers.ModelSerializer):
    """
    User this for public facing user data such as shared note page
    """
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'verified',
                  'password', 'created', 'updated', 'password_updated']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True, 'write_only': True},
            'created': {'write_only': True},
            'updated': {'write_only': True},
            'password_updated': {'write_only': True},
        }


class UserSerializer(serializers.ModelSerializer):
    """
    Only use this for authenticated user's own data
    """
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'verified',
                  'password', 'created', 'updated', 'password_updated']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True},
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
