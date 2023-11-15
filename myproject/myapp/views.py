from django.shortcuts import render
from .models import Item, Van_Nbhd, Ca_Nbhd, User, Poll, Badges, UserBadge
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status, generics, mixins
from .serializers import Van_Nbhd_Serializer, Ca_Nbhd_Serializer, UserSerializer, UserLocationSerializer, PollSerializer, BadgeSerializer
from django.contrib.gis.geos import Point

# Create your views here.


def item_list(request):
    items = Item.objects.all()
    items_data = [{'name': item.name, 'location': item.location}
                  for item in items]
    return render(request, "hello.html", {"items": items_data})


def api_item_list(request):
    items = Item.objects.all()
    item_list = [{"id": item.id, "name": item.name,
                  "description": item.description} for item in items]
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

    # Note the ordering: (longitude, latitude)
    point = Point(longitude, latitude, srid=4326)

    try:
        neighborhood = Van_Nbhd.objects.get(geom__contains=point)
        print(neighborhood)
        serializer = Van_Nbhd_Serializer(neighborhood)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Van_Nbhd.DoesNotExist:
        return Response({"error": "No neighborhood found for given coordinates"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

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
        # Convert the provided latitude and longitude to a Point
        longitude = float(request.data.get('longitude'))
        latitude = float(request.data.get('latitude'))
        location_point = Point(longitude, latitude, srid=4326)
        request.data['location'] = location_point

        serializer = UserLocationSerializer(
            user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_users_in_same_neighborhood(request, user_email):
    # Finding user with the given email
    try:
        user = User.objects.get(email=user_email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if not user.latitude or not user.longitude:
        return Response({"error": "User location not available"}, status=status.HTTP_404_NOT_FOUND)
    print(user.latitude, user.longitude)
    # Note the ordering: (longitude, latitude)
    point = Point(user.longitude, user.latitude, srid=4326)

    # Finding neighborhood for the user's location
    try:
        neighborhood = Van_Nbhd.objects.get(geom__contains=point)
    except Van_Nbhd.DoesNotExist:
        return Response({"error": "No neighborhood found for user's coordinates"}, status=status.HTTP_404_NOT_FOUND)

    # Finding users within the same neighborhood
    users_in_neighborhood = User.objects.filter(
        latitude__isnull=False,
        longitude__isnull=False,
        location__within=neighborhood.geom  # The ORM lookup
    ).exclude(email=user_email)

    # Extracting emails
    emails = [user.email for user in users_in_neighborhood]

    return Response({"users": emails}, status=status.HTTP_200_OK)


class PollCreateUpdateRetrieveAPIView(mixins.CreateModelMixin,
                                      mixins.RetrieveModelMixin,
                                      mixins.UpdateModelMixin,
                                      mixins.ListModelMixin,
                                      generics.GenericAPIView):
    serializer_class = PollSerializer

    def get_queryset(self):
        email = self.request.query_params.get('email', None)
        limit = self.request.query_params.get('limit', None)
        queryset = Poll.objects.all()

        if email:
            try:
                # Fetch the user
                user = User.objects.get(email=email)
                # Check user's location
                if not user.latitude or not user.longitude:
                    return Poll.objects.none()
                user_point = Point(user.longitude, user.latitude, srid=4326)
                # Fetch the neighborhood
                neighborhood = Van_Nbhd.objects.get(geom__contains=user_point)
                # Fetch users in the same neighborhood
                users_in_neighborhood = User.objects.filter(
                    latitude__isnull=False,
                    longitude__isnull=False,
                    location__within=neighborhood.geom
                )
                user_emails_in_neighborhood = [
                    user.email for user in users_in_neighborhood]
                queryset = queryset.filter(
                    created_by__email__in=user_emails_in_neighborhood)
            except (User.DoesNotExist, Van_Nbhd.DoesNotExist):
                return Poll.objects.none()

        if limit and limit.isdigit():
            queryset = queryset.order_by('-created_at')[:int(limit)]

        return queryset

    def get(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)



@api_view(['POST'])
def award_points_to_user(request, email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        points_to_add = int(request.data.get('points', 0))
        if points_to_add <= 0:
            raise ValueError("Points must be a positive integer.")
    except (ValueError, TypeError):
        return Response({"error": "Invalid points value provided"}, status=status.HTTP_400_BAD_REQUEST)

    user.points += points_to_add
    user.save()

    # Return a success response
    return Response({"message": f"Successfully awarded {points_to_add} points to user {email}."}, status=status.HTTP_200_OK)

@api_view(['GET', 'PUT'])
def update_user_profile(request, email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": f"Successfully updated profile for user {email}."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def award_verification_badge_to_user(request, email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    badge = Badges.objects.get(type=1)  # example logic
    if user.level == 1:  # change number to 3 when verification is done
        user_badge, created = UserBadge.objects.get_or_create(user=user, badge=badge)
        if created:
            # Serialize the awarded badge
            serializer = BadgeSerializer(badge)
            return Response({"message": f"Badge '{badge.name}' awarded to user {user.email}.", "badge": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Badge has already been awarded."}, status=status.HTTP_200_OK)
    else:
        # User does not meet the criteria for the badge
        return Response({"error": "User does not meet the criteria for the badge"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_user_badges(request, email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    user_badges = UserBadge.objects.filter(user=user).select_related('badge')
    badges = [user_badge.badge for user_badge in user_badges]
    serializer = BadgeSerializer(badges, many=True)
    return Response(serializer.data)
