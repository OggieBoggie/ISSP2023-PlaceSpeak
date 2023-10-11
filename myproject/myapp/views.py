from django.shortcuts import render
from .models import Item, Van_Nbhd, Ca_Nbhd, User
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import Van_Nbhd_Serializer, Ca_Nbhd_Serializer, UserSerializer

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
    print(request.data)
    if request.method == 'POST':
        print(request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            name = serializer.validated_data.get('name')
            image = serializer.validated_data.get('image')

            user, created = User.objects.get_or_create(email=email, defaults={
                'name': name,
                'image': image
            })

            if created:
                return Response({'message': f'User {user} created successfully.'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': f'User {user} already exists.'}, status=status.HTTP_200_OK)

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)