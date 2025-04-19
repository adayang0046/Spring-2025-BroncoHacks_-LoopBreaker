import copy
import os 
from django.shortcuts import render
from django.contrib.auth import get_user_model

# Render Landing Webpage
def chat_bot(request):


    return render(request, 'chatbot.html')