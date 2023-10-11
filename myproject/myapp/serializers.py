from rest_framework import serializers
from .models import Van_Nbhd, Ca_Nbhd, User
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


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[])
    
    class Meta:
        model = User
        fields = ('email', 'name', 'image')
