from rest_framework import serializers
from users.models import User, Verify

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'email_verified', 'password', 'created', 'updated']
        extra_kwargs = {
            'password': {'write_only':True, 'required':True},
            'email': {'required':True}
        }

class VerifySerializer(serializers.ModelSerializer):
    class Meta:
        model = Verify
        fields = ['id', 'user', 'token', 'created', 'consumed']