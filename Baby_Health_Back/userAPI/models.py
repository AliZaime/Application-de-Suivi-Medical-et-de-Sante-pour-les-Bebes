from django.db import models

class Parent(models.Model):
    parent_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    password = models.CharField(max_length=128)  # hashé manuellement
    notification_preferences = models.JSONField(default=dict)

    class Meta:
        db_table = 'parent'

    def __str__(self):
        return self.email
