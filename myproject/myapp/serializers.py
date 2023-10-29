from rest_framework import serializers
from rest_framework_gis import serializers as gis_serializers
from rest_framework.exceptions import ValidationError
from .models import Van_Nbhd, Ca_Nbhd, User, Poll, Choice, Badge
import json


class Ca_Nbhd_Serializer(serializers.ModelSerializer):
    geom = serializers.SerializerMethodField()

    class Meta:
        model = Ca_Nbhd
        fields = ['gid', 'name', 'geom']

    def get_geom(self, obj):
        geojson_str = obj.get_wgs84_geom().geojson
        return json.loads(geojson_str)


class Van_Nbhd_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Van_Nbhd
        fields = ['gid', 'name', 'geom']

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description']

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[])
    badges = BadgeSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['email', 'name', 'image', 'badges']


class UserLocationSerializer(gis_serializers.GeoFeatureModelSerializer):
    class Meta:
        model = User
        geo_field = "location"
        fields = ['email', 'name', 'image', 'latitude', 'longitude']


class ChoiceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Choice
        fields = ('id', 'text', 'vote_count')


class PollSerializer(serializers.ModelSerializer):
    created_by = serializers.EmailField(read_only=False)
    choices = ChoiceSerializer(many=True, required=False)

    class Meta:
        model = Poll
        fields = ('id', 'title', 'description',
                  'created_by', 'created_at', 'choices')

    def validate_created_by(self, email):
        """
        Check if the email exists in the User model.
        If it exists, return the user instance.
        """
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "User with this email does not exist")

    def create(self, validated_data):
        choices_data = validated_data.pop('choices', [])
        poll = Poll.objects.create(**validated_data)
        for choice_data in choices_data:
            Choice.objects.create(poll=poll, **choice_data)
        return poll

    def update(self, instance, validated_data):
        choices_data = validated_data.pop('choices', [])
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get(
            'description', instance.description)

        # Get existing choice IDs for the poll
        existing_choice_ids = set(
            instance.choices.values_list('id', flat=True))
        received_choice_ids = {choice.get(
            "id") for choice in choices_data if "id" in choice}

        # Choices to be deleted
        for choice_id in existing_choice_ids - received_choice_ids:
            Choice.objects.get(id=choice_id).delete()

        # Choices to be updated or created
        for choice_data in choices_data:
            if "id" in choice_data:
                choice = Choice.objects.get(id=choice_data["id"])
                choice.text = choice_data.get('text', choice.text)
                choice.save()
            else:
                Choice.objects.create(poll=instance, **choice_data)

        instance.save()
        return instance



