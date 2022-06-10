from turtle import title
from django.urls import path

from . import views
app_name = "encyclopedia"
urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:title>", views.title, name = "article"),
    path("result", views.result, name="result"),
    path("newpage", views.newpage, name = "newpage"),
    path('edit/<str:title>', views.edit, name = "edit"),
    path('random', views.random, name = "random"),
]
