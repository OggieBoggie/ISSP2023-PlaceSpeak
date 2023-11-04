from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Transform

# Create your models here.

# Test Model


class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    location = gis_models.PointField(
        srid=4326, default=Point(-122.938144, 49.223333))

    def __str__(self):
        return self.name


class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

# User Related Models


class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    # firstname = models.CharField(max_length=255)
    # lastname = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=10,
        choices=[("select", "-- Select your Gender -- "),
                 ("male", "Male"), ("female", "Female"), ("other", "Other")],
        default="select"
    )
    points = models.IntegerField(default=10)
    image = models.URLField(blank=True, null=True)
    facebook_url = models.TextField(blank=True, null=True)
    twitter_x_url = models.TextField(blank=True, null=True)
    linkedin_url = models.TextField(blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    location = gis_models.PointField(null=True, blank=True, srid=4326)

    class Meta:
        db_table = 'myapp_user'

    def __str__(self):
        return self.email

# UserFriend


class FriendShip(models.Model):
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user")
    friend = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friend")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10)  # define choices here

    class Meta:
        db_table = 'myapp_friendship'


class User_Friend(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_friends")
    friend = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friend_of_users")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=[("pending", "Pending"), ("accepted", "Accepted"),
                 ("rejected", "Rejected")],
        default="pending"
    )

    class Meta:
        db_table = 'myapp_userfriendship'


# Badge Related Models

class Badges(models.Model):
    type = models.BigIntegerField()
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    location = gis_models.PointField(null=True, blank=True, srid=4326)

    class Meta:
        db_table = 'myapp_badges'

    def __str__(self):
        return self.Name


class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badges, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'myapp_userbadges'

# Poll Related Models


class Poll(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    body = models.TextField(blank=True, null=True)
    score = models.SmallIntegerField(default=0)
    view_count = models.IntegerField(default=0)
    favorite_count = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="polls")
    # timestamp of when the poll was created
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'myapp_poll'

    def __str__(self):
        return self.title


class Choice(models.Model):
    poll = models.ForeignKey(
        Poll, on_delete=models.CASCADE, related_name="choices")
    text = models.CharField(max_length=255)
    # store the count of votes for optimization
    vote_count = models.IntegerField(default=0)

    class Meta:
        db_table = 'myapp_choice'

    def __str__(self):
        return self.text


class Vote(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="votes")
    poll = models.ForeignKey(
        Poll, on_delete=models.CASCADE, related_name="votes")
    choice = models.ForeignKey(
        Choice, on_delete=models.CASCADE, related_name="votes")
    # timestamp of when the vote was cast
    cast_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'myapp_vote'
        # ensuring one user can only vote once for a poll
        unique_together = ('user', 'poll')

    def __str__(self):
        return f"{self.user.email} voted for {self.choice.text} in {self.poll.title}"


class Tag(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

# Map Based Models


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
