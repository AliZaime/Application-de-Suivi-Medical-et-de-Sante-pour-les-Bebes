from django.db import models

class Message(models.Model):
    texte = models.CharField(max_length=255)

    def __str__(self):
        return self.texte
