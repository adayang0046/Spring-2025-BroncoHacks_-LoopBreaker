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
        user_question = data.get("question", "").strip()

        if not user_question:
            user_question = (
                "Introduce yourself as Williams, a wildfire safety assistant AI. "
                "Greet the user warmly and let them know what kind of help you can offer."
            )

        prompt = f"""
        You are Williams, a helpful and friendly AI assistant focused on wildfire safety.
        You speak clearly, shortly and warmly, like a caring expert.
        Your job is to answer wildfire safety questions using best practices and emergency tips.
        If the user says something off-topic, kindly guide them back.

        Question: {user_question}
        """

        try:
            response = model.generate_content(prompt)
            return JsonResponse({"response": response.text})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST allowed."}, status=405)

