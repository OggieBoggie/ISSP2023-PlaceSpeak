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
]
