from rest_framework import serializers
from .models import Parent
from django.contrib.auth.hashers import make_password

class ParentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Parent
        fields = ['parent_id', 'name', 'email', 'phone', 'password', 'notification_preferences']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])  # hash du mot de passe
        return super().create(validated_data)
