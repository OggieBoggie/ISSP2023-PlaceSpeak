from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point

# Create your models here.


class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    location = gis_models.PointField(srid=4326, default=Point(-122.938144, 49.223333))

    def __str__(self):
        return self.name
    

class Van_Nbhd(models.Model):
    gid = models.AutoField(primary_key=True, default=1)
    name = models.CharField(max_length=255)
    geom = gis_models.MultiPolygonField(srid=4326)

    class Meta:
        db_table = 'myapp_van_nbhd'

    def __str__(self):
        return self.name