from django.db import models


class Parent(models.Model):
    parent_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True,default="default@example.com")
    phone = models.CharField(max_length=20)
    password = models.CharField(max_length=128)  # ⚠️ stocké en clair ou hashé manuellement
    notification_preferences = models.JSONField(default=dict)

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
    
class BabyTracking(models.Model):
    tracking_id = models.AutoField(primary_key=True)
    baby = models.ForeignKey(Baby, on_delete=models.CASCADE, related_name='tracking')
    weight = models.FloatField()
    height = models.FloatField()
    head_circumference = models.FloatField()
    date_recorded = models.DateField(auto_now_add=True)
    note = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'baby_tracking'

    def __str__(self):
        return f"{self.baby.name} - {self.date_recorded}"