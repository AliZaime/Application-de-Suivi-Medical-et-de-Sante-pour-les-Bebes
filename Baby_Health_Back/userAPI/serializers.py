from rest_framework import serializers
from .models import Medicament, Parent, Baby, Appointment, Couche, Symptome, Temperature, Tetee, advice, CryDetection
from .models import Biberon, Parent, Baby, Appointment, Couche, Solides, Sommeil, Tetee,BabyTracking, Vaccination, note
from django.contrib.auth.hashers import make_password

class ParentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Parent
        fields = ['parent_id', 'name', 'email', 'phone', 'password', 'notification_preferences','gender']

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

class CoucheSerializer(serializers.ModelSerializer):
    class Meta:
        model = Couche
        fields = ['id', 'type', 'date', 'heure', 'cause', 'remarque', 'baby']

class TeteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tetee
        fields = ['id', 'date', 'heure', 'temps_passe', 'remarque', 'baby']

class AdviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = advice
        fields = ['id', 'title', 'content', 'date', 'category', 'image']

    def create(self, validated_data):
        return super().create(validated_data)

class BabyTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BabyTracking
        fields = ['tracking_id', 'baby', 'weight', 'height', 'head_circumference', 'date_recorded','note']
    
    def create(self, validated_data):
        return super().create(validated_data)
    
class BiberonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Biberon
        fields = ['id', 'quantite', 'date', 'heure', 'source', 'remarque', 'baby']

class SolidesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solides
        fields = ['id', 'type', 'date', 'heure', 'quantite', 'baby']

class SommeilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sommeil
        fields = ['id', 'dateDebut', 'dateFin', 'duration', 'remarque', 'baby']

class TemperatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Temperature
        fields = ['id', 'date', 'heure', 'temperature', 'remarque', 'baby']

class MedicamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicament
        fields = ['id', 'name', 'type', 'heure', 'dosage', 'remarque', 'baby']

class SymptomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptome
        fields = [
            'id',
            'baby',
            'date',
            'heure',
            'symptomes',
            'remarque',
            'predicted_disease',
            'description',
            'precautions',
            'top_5_diseases',
        ]
        
class CryDetectionSerializer(serializers.ModelSerializer):
    baby_name = serializers.CharField(source='baby.name', read_only=True)

    class Meta:
        model = CryDetection
        fields = ['id', 'baby', 'baby_name', 'label', 'confidence', 'detected_at']

class VaccinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vaccination
        fields = ['id', 'baby', 'vaccine_name', 'date_administered', 'next_due_date', 'remarks']

    def create(self, validated_data):
        return super().create(validated_data)

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = note
        fields = ['id', 'title', 'parent', 'content', 'date_created']

    def create(self, validated_data):
        return super().create(validated_data)
