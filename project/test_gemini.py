import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load API key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("ERROR: No API key found in .env file!")
else:
    print(f"API Key found: {api_key[:10]}...{api_key[-4:]}")

    # Configure with the API key
    genai.configure(api_key=api_key)

    print("\n=== Available Models ===")
    try:
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                print(f"✓ {model.name}")
    except Exception as e:
        print(f"Error listing models: {e}")
        print("\nThis likely means your API key is invalid or expired.")
        print("Please create a new one at: https://aistudio.google.com/app/apikey")
