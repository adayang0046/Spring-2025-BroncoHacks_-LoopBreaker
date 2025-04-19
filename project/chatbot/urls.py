from django.urls import path

from .views import ask_williams, chat_bot

urlpatterns = [
    path("", chat_bot, name="chatbot_home"),
    path("ask/", ask_williams, name="ask_williams"),
]