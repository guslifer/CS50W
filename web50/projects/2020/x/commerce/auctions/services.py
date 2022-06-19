from django.db import models
from .models import Listings, Bids
from django.db.models import Max
from django.db.models import Q

def highest_bid(listing_id):
    highest = {}
    listing = Listings.objects.get(id = listing_id)
    try:
        highest = Bids.objects.filter(listing = listing).aggregate(Max("price"))
        bid = Bids.objects.filter(listing = listing).get(price = float(highest['price__max']))
        listing.highest_bid = bid
    except:
        highest['price__max'] = listing.base_price
        
    listing.save()
    return float(highest['price__max'])
    


    