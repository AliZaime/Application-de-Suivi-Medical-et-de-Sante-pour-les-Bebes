from rest_framework import serializers
from .models import Parent, Baby, Appointment
from django.contrib.auth.hashers import make_password

class ParentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Parent
        fields = ['parent_id', 'name', 'email', 'phone', 'password', 'notification_preferences']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class BabySerializer(serializers.ModelSerializer):
    class Meta:
        model = Baby
        fields = ['baby_id', 'name', 'date_of_birth', 'gender', 'blood_type', 'profile_picture', 'parent']        
    def create(self, validated_data):
        return super().create(validated_data)

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['appointment_id', 'parent', 'time', 'value', 'place']
        
    def create(self, validated_data):
        return super().create(validated_data)
