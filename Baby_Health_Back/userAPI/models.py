from django.db import models
from django.contrib.auth.models import User


class Parent(models.Model):
    parent_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True,default="default@example.com")
    phone = models.CharField(max_length=20)
    password = models.CharField(max_length=128)  # ⚠️ stocké en clair ou hashé manuellement
    notification_preferences = models.JSONField(default=dict)
    gender = models.CharField(max_length=10, default='Not specified')

    class Meta:
        db_table = 'parent'

    def __str__(self):
        return self.email

    
    
class Baby(models.Model):
    baby_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=255)
    blood_type = models.CharField(max_length=255)
    profile_picture = models.CharField(max_length=255)
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name='babies')

    class Meta:
        db_table = 'baby_profile'

    def __str__(self):
        return self.name
    

class Appointment(models.Model):
    appointment_id = models.AutoField(primary_key=True)
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name='appointments')
    time = models.DateTimeField()
    value = models.CharField(max_length=255)
    place = models.CharField(max_length=255)

    class Meta:
        db_table = 'appointment'

    def __str__(self):
        return f"Appointment at {self.place} on {self.time}"
