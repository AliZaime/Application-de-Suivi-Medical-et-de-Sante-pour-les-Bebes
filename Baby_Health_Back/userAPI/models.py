from django.utils import timezone
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

    expo_token = models.CharField(max_length=255, blank=True, null=True)
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
    
class Biberon(models.Model):
    id = models.AutoField(primary_key=True)  # Identifiant unique pour chaque biberon
    quantite = models.IntegerField()  # Quantité de lait en ml
    date = models.DateField()  # Date de la prise du biberon
    heure = models.TimeField()  # Heure de la prise du biberon
    source = models.CharField(max_length=20, choices=[('sein', 'Sein'), ('lait_artificiel', 'Lait artificiel')])  # Source du lait
    remarque = models.CharField(max_length=255, blank=True, null=True)  # Remarque optionnelle
    baby = models.ForeignKey('Baby', on_delete=models.CASCADE, related_name='biberons')  # Relation avec le bébé

    class Meta:
        db_table = 'biberon'  # Nom explicite de la table dans la base de données

    def __str__(self):
        return f"Biberon de {self.quantite} ml ({self.source}) - {self.date} {self.heure} (Baby ID: {self.baby.id})"
    
class Solides(models.Model):
    TYPE_CHOICES = [
        ('fruit', 'Fruit'),
        ('legumes', 'Légumes'),
        ('cereales', 'Céréales'),
        ('viandes', 'Viandes'),
        ('proteines', 'Protéines'),
    ]

    id = models.AutoField(primary_key=True) 
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    date = models.DateField() 
    heure = models.TimeField() 
    quantite = models.IntegerField()
    baby = models.ForeignKey('Baby', on_delete=models.CASCADE, related_name='solides')

    class Meta:
        db_table = 'solides'

    def __str__(self):
        return f"{self.type} - {self.quantite}g ({self.date} {self.heure}) (Baby ID: {self.baby.id})"
    
class Sommeil(models.Model):
    id = models.AutoField(primary_key=True)
    dateDebut = models.DateTimeField()
    dateFin = models.DateTimeField()
    duration = models.IntegerField()
    remarque = models.CharField(max_length=255, blank=True, null=True)
    baby = models.ForeignKey('Baby', on_delete=models.CASCADE, related_name='sommeils')

    class Meta:
        db_table = 'sommeils'
    
    def __str__(self):
        return f"Sommeil de {self.baby.name} du {self.dateDebut} au {self.dateFin} ({self.duration} minutes)"
    
class Temperature(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    heure = models.TimeField()
    temperature = models.FloatField()
    remarque = models.CharField(max_length=255, blank=True, null=True)
    baby = models.ForeignKey('Baby', on_delete=models.CASCADE, related_name='temperatures')

    class Meta:
        db_table = 'temperature'

    def __str__(self):
        return f"Température de {self.baby.name} le {self.date} à {self.heure} : {self.temperature}°C"
    
class Medicament(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    heure = models.TimeField()
    dosage = models.FloatField()
    remarque = models.CharField(max_length=255, blank=True, null=True) 
    baby = models.ForeignKey('Baby', on_delete=models.CASCADE, related_name='medicaments') 

    class Meta:
        db_table = 'medicament'

    def __str__(self):
        return f"Médicament {self.name} - ({self.type}) ({self.dosage}) - {self.heure} (Baby ID: {self.baby.id})"
    

class CryDetection(models.Model):
    baby = models.ForeignKey(Baby, on_delete=models.CASCADE, related_name='cry_detections')
    label = models.CharField(max_length=100)  # Exemple : "pleur", "colique", "faim"
    confidence = models.FloatField()  # Entre 0 et 1
    detected_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'cryDetection'

    def __str__(self):
        return f"{self.baby.name} - {self.label} ({self.detected_at.strftime('%Y-%m-%d %H:%M:%S')})"
