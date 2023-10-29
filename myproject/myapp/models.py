from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Transform

# Create your models here.


class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    location = gis_models.PointField(srid=4326, default=Point(-122.938144, 49.223333))
    
    def __str__(self):
        return self.name

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Ca_Nbhd(models.Model):
    gid = models.AutoField(primary_key=True, default=1)
    name = models.CharField(max_length=255)
    geom = gis_models.MultiPolygonField(srid=3857)

    class Meta:
        db_table = 'myapp_ca_nbhd'  # map to existing data at myapp_ca_nbhd table

    def __str__(self):
        return self.name

    def get_wgs84_geom(self):
        return self.geom.transform(4326, clone=True)


class Van_Nbhd(models.Model):
    gid = models.AutoField(primary_key=True, default=1)
    name = models.CharField(max_length=255)
    geom = gis_models.MultiPolygonField(srid=4326)

    class Meta:
        db_table = 'myapp_van_nbhd'

    def __str__(self):
        return self.name


class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    image = models.URLField(blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'myapp_user'

    def __str__(self):
        return self.email


class Poll(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="polls")
    created_at = models.DateTimeField(auto_now_add=True)  # timestamp of when the poll was created

    class Meta:
        db_table = 'myapp_poll'

    def __str__(self):
        return self.title


class Choice(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="choices")
    text = models.CharField(max_length=255)
    vote_count = models.IntegerField(default=0)  # store the count of votes for optimization

    class Meta:
        db_table = 'myapp_choice'

    def __str__(self):
        return self.text


class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="votes")
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="votes")
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE, related_name="votes")
    cast_at = models.DateTimeField(auto_now_add=True)  # timestamp of when the vote was cast

    class Meta:
        db_table = 'myapp_vote'
        unique_together = ('user', 'poll')  # ensuring one user can only vote once for a poll

    def __str__(self):
        return f"{self.user.email} voted for {self.choice.text} in {self.poll.title}"