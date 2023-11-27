from django.contrib import admin
from .models import Item, Van_Nbhd, Ca_Nbhd, Badges, UserBadge

# Register your models here.


admin.site.register(Item)
admin.site.register(Van_Nbhd)
admin.site.register(Ca_Nbhd)
admin.site.register(Badges)
admin.site.register(UserBadge)