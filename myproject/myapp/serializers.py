from rest_framework import serializers
from .models import Van_Nbhd

class Van_Nbhd_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Van_Nbhd
        fields = ['gid', 'name', 'geom']
