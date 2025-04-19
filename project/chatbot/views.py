import copy
import os 
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json 
import google.generativeai as genai 
from dotenv import load_dotenv

# Load API key from.env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-1.5-pro-latest")

def chat_bot(request):
    return render(request, 'chatbot.html')

# Render Landing Webpage
@csrf_exempt
def ask_williams(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_question = data.get("question", "")

        try:
            response = model.generate_content(user_question)
            return JsonResponse({"response": response.text})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST allowed."}, status=405)

