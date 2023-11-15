from django.urls import path
from . import views

urlpatterns = [
    path("items/", views.item_list, name="item_list"),
    path('api/items/', views.api_item_list, name='api_item_list'),
    path('api/van_nbhd/<int:gid>/', views.get_van_nbhd),
    path('api/ca_nbhd/<int:gid>/', views.get_ca_nbhd),
    path('api/saveuser/', views.save_user, name='save_user'),
    path('api/van_nbhd/', views.get_van_nbhd_over_point,
         name='get_van_nbhd_over_point'),
    path('api/user_location/<str:email>/',
         views.update_user_location, name='update_user_location'),
    path('api/polls/', views.PollCreateUpdateRetrieveAPIView.as_view(),
         name='poll-create-list'),
    path('api/polls/<int:pk>/', views.PollCreateUpdateRetrieveAPIView.as_view(),
         name='poll-retrieve-update'),
    path('api/users_in_same_neighborhood/<str:user_email>/',
         views.get_users_in_same_neighborhood, name='users_in_same_neighborhood'),
    path('api/users', views.get_all_users, name='all_users'),
    path('api/van_nbhd/', views.get_van_nbhd_over_point, name='get_van_nbhd_over_point'),
    path('api/user_location/<str:email>/', views.update_user_location, name='update_user_location'),
    path('api/polls/', views.PollCreateUpdateRetrieveAPIView.as_view(), name='poll-create-list'),
    path('api/polls/<int:pk>/', views.PollCreateUpdateRetrieveAPIView.as_view(), name='poll-retrieve-update'),
    path('api/award-points/<str:email>/', views.award_points_to_user, name='award-points-to-user'),
    path('api/users/profile/<str:email>/', views.update_user_profile, name='update-user-profile'),
    path('api/award-verification-badge/<str:email>', views.award_verification_badge_to_user, name='award-verification-badge-to-user'),
    path('api/get-badges/<str:email>', views.get_user_badges, name='get-user-badges')
]
