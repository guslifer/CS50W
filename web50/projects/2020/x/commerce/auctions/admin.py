from django.contrib import admin
from .models import Listings, Bids, Comments, Categories, User

# Register your models here.

class BidsAdmin(admin.ModelAdmin):
    exclude = ('id',)
    
class ListingsAdmin(admin.ModelAdmin):
    exclude = ('id',)
    
class CommmentsAdmin(admin.ModelAdmin):
    exclude = ('id',)

class CategoriesAdmin(admin.ModelAdmin):
    exclude = ('id',)

admin.site.register(User)
admin.site.register(Listings,ListingsAdmin)
admin.site.register(Bids,BidsAdmin)
admin.site.register(Comments,CommmentsAdmin)
admin.site.register(Categories,CategoriesAdmin)
