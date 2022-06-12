from tkinter import CASCADE
from unicodedata import category
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import CharField, DateTimeField, FloatField, IntegerField


class User(AbstractUser):
    pass

class Categories(models.Model):
    id = models.IntegerField(primary_key = True)
    category = models.CharField(max_length=100)

class Listings(models.Model):
    ACTIVE = 1
    CANCELLED = 2
    SOLD = 3
    STATUS_CHOICES = (
        (ACTIVE, 'Active'),
        (CANCELLED, 'Cancelled'),
        (SOLD, 'Sold')
    )
    
    id = models.IntegerField(primary_key = True)
    product_name = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    publish_date = models.DateTimeField(auto_now_add=True)
    base_price = models.FloatField()
    image_url = models.URLField()
    category = models.ForeignKey(Categories, related_name="listinings",on_delete=CASCADE,null=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default = ACTIVE)
    author = models.ForeignKey(User, related_name="listings",null=True,on_delete=CASCADE)
    highest_bid = models.ForeignKey("Bids", related_name="listings", on_delete=CASCADE,null=True)
    

class Bids(models.Model):
    id = models.IntegerField(primary_key = True)
    price = models.FloatField()
    author = models.ForeignKey(User, related_name="bids", on_delete=CASCADE,null=True)
    
class Comments(models.Model):
    comment = models.CharField(max_length=500)
    author = models.ForeignKey(User, related_name="comments",null=True,on_delete=CASCADE)
    
    

