from tkinter import ACTIVE
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.core.exceptions import ValidationError
import datetime
from .services import *
from django.views.decorators.cache import never_cache

from .models import User, Listings, Categories


def index(request):
    listings = Listings.objects.filter(status=Listings.ACTIVE)
    return render(request, "auctions/index.html", {"listings": listings})

def newlisting(request):
    if (request.method == "POST" and request.user.is_authenticated):
        new = Listings(
            product_name = request.POST["product_name"],
            category = Categories.objects.get(category = request.POST["category"]),
            description = request.POST["description"],
            image_url = request.POST["img_url"],
            base_price = request.POST["base_price"],
            status = Listings.ACTIVE,
            author = request.user,
            publish_date = datetime.datetime.now()
        )
        #need to ensure validation someday
        new.save()
            
    categories = Categories.objects.all
    return render(request, "auctions/newlisting.html", {"categories":categories})

@never_cache
def details(request, listing_id):
    listing = Listings.objects.get(id=listing_id)
    actual_price = highest_bid(listing_id)
    if request.method == "POST":
        if "close_auction" in request.POST:
            listing.status = Listings.SOLD
            listing.save()
            
        if request.POST["make_bid"] and request.user.is_authenticated:
            if (listing.status == Listings.ACTIVE):
                if (float(request.POST["new_bid"]) > actual_price):
                    new_bid = Bids(author = request.user, price = request.POST["new_bid"], listing = listing)
                    new_bid.save()
                    highest_bid(listing_id)
                    listing.refresh_from_db()
                    return render(request, "auctions/details.html", {"listing":listing, "message": "Bid made!"})
                else: 
                    return render(request, "auctions/details.html", {"listing":listing, "message": "Bid too little"})

    return render(request, "auctions/details.html", {"listing":listing, "actual_price": actual_price})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("auctions:index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("auctions:index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("auctions:index"))
    else:
        return render(request, "auctions/register.html")
