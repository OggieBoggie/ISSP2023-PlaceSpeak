# Generated by Django 4.2.5 on 2023-11-16 01:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0017_alter_user_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='badges',
            name='image',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
