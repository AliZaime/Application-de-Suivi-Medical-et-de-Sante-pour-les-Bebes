from rest_framework import serializers
from .models import Parent, Baby, BabyTracking
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
    
class BabyTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BabyTracking
        fields = ['tracking_id', 'baby', 'weight', 'height', 'head_circumference', 'date_recorded','note']
    
    def create(self, validated_data):
        return super().create(validated_data)