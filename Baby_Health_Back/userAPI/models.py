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


class Couche(models.Model):
    TYPE_CHOICES = [
        ('mixte', 'Mixte'),
        ('urine', 'Urine'),
        ('souillee', 'Souillée'),
    ]
    CAUSE_CHOICES = [
        ('Normale', 'Normale'),
        ('Diarrhée', 'Diarrhée'),
        ('Molle', 'Molle'),
        ('Liquide', 'Liquide'),
        ('Constipation', 'Constipation'),
        ('Autre', 'Autre'),
    ]

    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    date = models.DateField()
    heure = models.TimeField()
    cause = models.CharField(max_length=30, choices=CAUSE_CHOICES, blank=True)
    remarque = models.CharField(max_length=255, blank=True)
    baby = models.ForeignKey(Baby, on_delete=models.CASCADE, related_name='couches')

    class Meta:
        db_table = 'couche'

    def __str__(self):
        return f"{self.type} - {self.date} {self.heure} ({self.baby.name})"

class Tetee(models.Model):
    id = models.AutoField(primary_key=True)  # Correspond à la colonne `id` dans la table
    date = models.DateField()  # Correspond à la colonne `date`
    heure = models.TimeField()  # Correspond à la colonne `heure`
    temps_passe = models.IntegerField()  # Correspond à la colonne `temps_passe`
    remarque = models.CharField(max_length=255, blank=True, null=True)  # Correspond à la colonne `remarque`
    baby = models.ForeignKey('Baby', on_delete=models.CASCADE, related_name='tetees')  # Correspond à la colonne `baby`

    class Meta:
        db_table = 'tetee'  # Spécifie explicitement le nom de la table

    def __str__(self):
        return f"Tétée du {self.date} à {self.heure} (Baby ID: {self.baby.id})"
    
class BabyTracking(models.Model):
    tracking_id = models.AutoField(primary_key=True)
    baby = models.ForeignKey(Baby, on_delete=models.CASCADE, related_name='tracking')
    weight = models.FloatField()
    height = models.FloatField()
    head_circumference = models.FloatField()
    date_recorded = models.DateField()
    note = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'baby_tracking'

    def __str__(self):
        return f"{self.baby.name} - {self.date_recorded}"