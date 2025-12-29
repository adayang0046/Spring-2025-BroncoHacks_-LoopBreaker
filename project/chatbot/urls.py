from django.urls import path

from .views import ask_williams, get_fires

urlpatterns = [
    path("ask/", ask_williams, name="ask_williams"),
    path("fires/", get_fires, name="get_fires"),
]