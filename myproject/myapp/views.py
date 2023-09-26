from django.shortcuts import render
from .models import Item, Van_Nbhd
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import Van_Nbhd_Serializer

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
def get_van_nbhd(request, gid):
    try:
        nbhd = Van_Nbhd.objects.get(gid=gid)
    except Van_Nbhd.DoesNotExist:
        return Response({"error": "Neighborhood not found"}, status=404)

    serializer = Van_Nbhd_Serializer(nbhd)
    return Response(serializer.data)