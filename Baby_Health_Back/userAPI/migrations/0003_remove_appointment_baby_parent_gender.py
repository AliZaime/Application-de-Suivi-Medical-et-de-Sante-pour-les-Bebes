# Generated by Django 5.2 on 2025-05-29 14:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userAPI', '0002_appointment'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appointment',
            name='baby',
        ),
        migrations.AddField(
            model_name='parent',
            name='gender',
            field=models.CharField(default='Not specified', max_length=10),
        ),
    ]
