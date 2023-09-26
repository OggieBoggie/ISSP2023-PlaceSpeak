from django.urls import path
from . import views

urlpatterns = [
    path("items/", views.item_list, name="item_list"),
    path('api/items/', views.api_item_list, name='api_item_list'),
    path('api/van_nbhd/<int:gid>/', views.get_van_nbhd),
]
