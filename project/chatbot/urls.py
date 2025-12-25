from django.urls import path

from .views import ask_williams

urlpatterns = [
    path("ask/", ask_williams, name="ask_williams"),
]