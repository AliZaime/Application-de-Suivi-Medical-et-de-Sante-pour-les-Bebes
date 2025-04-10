from rest_framework import serializers
from django.contrib.auth.models import User  # Use the built-in User model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
