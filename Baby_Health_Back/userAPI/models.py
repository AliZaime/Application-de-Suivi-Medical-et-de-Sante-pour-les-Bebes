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
    id = models.AutoField(primary_key=True)
    date = models.DateField()  # Date de la tétée
    heure = models.TimeField()  # Heure de la tétée
    temps_passe = models.PositiveIntegerField()  # Temps passé en minutes
    remarque = models.CharField(max_length=255, blank=True)  # Remarque optionnelle
    baby = models.ForeignKey(Baby, on_delete=models.CASCADE, related_name='tetees')  # Relation avec le bébé

    class Meta:
        db_table = 'tetee'

    def __str__(self):
        return f"Tétée - {self.date} {self.heure} ({self.baby.name})"

class category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)  # Nom de la catégorie
    description = models.TextField(blank=True)  # Description de la catégorie

    class Meta:
        db_table = 'category'

    def __str__(self):
        return self.name

class advice(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)  # Titre de l'avis
    content = models.TextField()  # Contenu de l'avis
    date = models.DateField(auto_now_add=True)  # Date de création de l'avis
    category = models.ForeignKey(category, on_delete=models.CASCADE, related_name='advice')  # Relation avec la catégorie
    image = models.CharField(max_length=255, blank=True)  # Chemin de l'image associée à l'avis
    class Meta:
        db_table = 'advice'

    def __str__(self):
        return self.title