# Generated by Django 4.2.5 on 2023-11-16 01:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0016_remove_badges_latitude_remove_badges_location_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
