from django.shortcuts import render
from .models import Item, Van_Nbhd, Ca_Nbhd, User
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import Van_Nbhd_Serializer, Ca_Nbhd_Serializer, UserSerializer, UserLocationSerializer
from django.contrib.gis.geos import Point

# Create your views here.


def item_list(request):
    items = Item.objects.all()
    items_data = [{'name': item.name, 'location': item.location} for item in items]
    return render(request, "hello.html", {"items": items_data})


def api_item_list(request):
    items = Item.objects.all()
    item_list = [{"id": item.id, "name": item.name, "description": item.description} for item in items]
    return JsonResponse(item_list, safe=False)


@api_view(['GET'])
def get_ca_nbhd(request, gid):
    try:
        nbhd = Ca_Nbhd.objects.get(gid=gid)
    except Ca_Nbhd.DoesNotExist:
        return Response({"error": "Neighborhood not found"}, status=404)

    serializer = Ca_Nbhd_Serializer(nbhd)
    return Response(serializer.data)


@api_view(['GET'])
def get_van_nbhd(request, gid):
    try:
        nbhd = Van_Nbhd.objects.get(gid=gid)
    except Van_Nbhd.DoesNotExist:
        return Response({"error": "Neighborhood not found"}, status=404)

    serializer = Van_Nbhd_Serializer(nbhd)
    return Response(serializer.data)


@api_view(['POST'])
def save_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            name = serializer.validated_data.get('name')
            image = serializer.validated_data.get('image')

            user, created = User.objects.get_or_create(email=email, defaults={
                'name': name,
                'image': image
            })
            print(user, created)

            if created:
                return Response({'message': f'User {user} created successfully.'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': f'User {user} already exists.'}, status=status.HTTP_200_OK)

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_van_nbhd_over_point(request):
    try:
        longitude = float(request.query_params.get('longitude'))
        latitude = float(request.query_params.get('latitude'))
    except (ValueError, TypeError):
        return Response({"error": "Invalid longitude or latitude values"}, status=status.HTTP_400_BAD_REQUEST)

    point = Point(longitude, latitude, srid=4326)  # Note the ordering: (longitude, latitude)
    
    try:
        neighborhood = Van_Nbhd.objects.get(geom__contains=point)
        print(neighborhood)
        serializer = Van_Nbhd_Serializer(neighborhood)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Van_Nbhd.DoesNotExist:
        return Response({"error": "No neighborhood found for given coordinates"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET', 'PUT'])
def update_user_location(request, email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserLocationSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserLocationSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)