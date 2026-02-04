from django.urls import path

from .views import ask_williams, get_fires, get_chat_history

urlpatterns = [
    path("ask/", ask_williams, name="ask_williams"),
    path("fires/", get_fires, name="get_fires"),
    path("history/", get_chat_history, name="get_chat_history"),  # View chat history from database
]