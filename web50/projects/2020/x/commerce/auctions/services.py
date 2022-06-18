from django.db import models
from .models import Listings, Bids
from django.db.models import Max

def highest_bid(listing_id):

    highest = Bids.objects.aggregate(Max("price"))
    bid = Bids.objects.get(price = float(highest['price__max']))
    listing = Listings.objects.get(id = listing_id)
    listing.highest_bid = bid
    listing.save()

    return float(highest['price__max'])
    


    