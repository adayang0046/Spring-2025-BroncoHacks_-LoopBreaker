import copy
import os
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
import json
import pandas as pd
import google.generativeai as genai
from dotenv import load_dotenv
import requests
from io import StringIO
from math import radians, cos, sin, asin, sqrt

from pathlib import Path

# Load API key from .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-2.5-flash")


# Helper function: Calculate distance between two coordinates in miles
def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points
    on the earth (specified in decimal degrees)
    Returns distance in miles
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))

    # Radius of earth in miles
    r = 3956

    return c * r


# Helper function: Get fire data (reusable from get_fires view)
def fetch_fire_data():
    """
    Fetch fire data from NASA FIRMS API or cache
    Returns GeoJSON format
    """
    # Check cache first
    cache_key = 'nasa_firms_fires'
    cached_data = cache.get(cache_key)

    if cached_data:
        return cached_data

    try:
        map_key = os.getenv("MAP_KEY")
        if not map_key:
            return None

        days = 10
        url = f"https://firms.modaps.eosdis.nasa.gov/api/country/csv/{map_key}/VIIRS_SNPP_NRT/USA/{days}"

        response = requests.get(url, timeout=10)
        response.raise_for_status()

        df = pd.read_csv(StringIO(response.text))

        features = []
        for _, row in df.iterrows():
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(row['longitude']), float(row['latitude'])]
                },
                "properties": {
                    "brightness": float(row['bright_ti4']) if 'bright_ti4' in row else None,
                    "confidence": str(row['confidence']) if 'confidence' in row else 'unknown',
                    "acq_date": str(row['acq_date']) if 'acq_date' in row else 'unknown',
                    "acq_time": str(row['acq_time']) if 'acq_time' in row else 'unknown',
                    "satellite": str(row['satellite']) if 'satellite' in row else 'VIIRS',
                    "frp": float(row['frp']) if 'frp' in row else None
                }
            }
            features.append(feature)

        geojson_data = {
            "type": "FeatureCollection",
            "features": features,
            "metadata": {
                "count": len(features),
                "days": days,
                "source": "NASA FIRMS VIIRS",
                "updated": pd.Timestamp.now().isoformat()
            }
        }

        cache.set(cache_key, geojson_data, 3600)
        return geojson_data

    except Exception as e:
        print(f"Error fetching fire data: {e}")
        return None


def chat_bot(request):
    return render(request, 'chatbot.html')

# Render Landing Webpage - NOW FIRE-AWARE! 🔥
@csrf_exempt
def ask_williams(request):
    if request.method == 'POST':
        # Emergency kill switch - set DISABLE_AI=true in Render to stop API calls
        if os.getenv('DISABLE_AI', 'false').lower() == 'true':
            return JsonResponse({
                "reply": "Williams is temporarily unavailable for maintenance. Please check back later!"
            })

        data = json.loads(request.body)
        user_question = data.get("question", "").strip()
        latitude = data.get("latitude", "")
        longitude = data.get("longitude", "")

        # Check cache for intro message (save money on every page load!)
        if not user_question:  # Auto-intro message
            cache_key = "williams_intro_message"
            cached_intro = cache.get(cache_key)
            if cached_intro:
                return JsonResponse({"reply": cached_intro})

        # Fetch live fire data from NASA FIRMS
        fire_data = fetch_fire_data()

        # Build fire context for Williams
        fire_context = ""

        if fire_data and latitude and longitude:
            try:
                user_lat = float(latitude)
                user_lon = float(longitude)

                # Find fires within 100 miles
                nearby_fires = []

                for feature in fire_data.get('features', []):
                    fire_coords = feature['geometry']['coordinates']
                    fire_lon, fire_lat = fire_coords[0], fire_coords[1]

                    # Calculate distance
                    distance = calculate_distance(user_lat, user_lon, fire_lat, fire_lon)

                    if distance <= 100:  # Within 100 miles
                        fire_info = {
                            'distance': round(distance, 1),
                            'date': feature['properties'].get('acq_date', 'unknown'),
                            'time': feature['properties'].get('acq_time', 'unknown'),
                            'confidence': feature['properties'].get('confidence', 'unknown'),
                            'frp': feature['properties'].get('frp', 'N/A'),
                            'lat': fire_lat,
                            'lon': fire_lon
                        }
                        nearby_fires.append(fire_info)

                # Sort by distance (closest first)
                nearby_fires.sort(key=lambda x: x['distance'])

                # Build context string
                if nearby_fires:
                    fire_context = f"\n\n🔥 CRITICAL REAL-TIME FIRE DATA (NASA FIRMS satellite detection):\n"
                    fire_context += f"⚠️ {len(nearby_fires)} active fire(s) detected within 100 miles of user's location!\n\n"

                    # Include top 5 closest fires
                    for i, fire in enumerate(nearby_fires[:5], 1):
                        direction = get_direction(user_lat, user_lon, fire['lat'], fire['lon'])
                        fire_context += f"Fire #{i}:\n"
                        fire_context += f"  - Distance: {fire['distance']} miles {direction}\n"
                        fire_context += f"  - Detected: {fire['date']} at {fire['time']} UTC\n"
                        fire_context += f"  - Confidence: {fire['confidence']}\n"
                        fire_context += f"  - Fire Power: {fire['frp']} MW\n\n"

                    if len(nearby_fires) > 5:
                        fire_context += f"(Plus {len(nearby_fires) - 5} more fires detected in the area)\n\n"

                    fire_context += "⚠️ USE THIS REAL DATA to provide specific, location-aware safety advice!\n"
                else:
                    fire_context = f"\n\n✅ GOOD NEWS: No active fires detected within 100 miles of user's location (last 10 days).\n"
                    fire_context += f"Total fires in USA: {len(fire_data.get('features', []))} (NASA FIRMS data)\n\n"

            except (ValueError, TypeError) as e:
                fire_context = "\n\n(Unable to calculate fire proximity - location data invalid)\n"

        elif fire_data:
            total_fires = len(fire_data.get('features', []))
            fire_context = f"\n\n🔥 Current wildfire status: {total_fires} active fires detected across USA (NASA FIRMS, last 10 days)\n"
            fire_context += "(User location unavailable - unable to provide proximity warnings)\n\n"
        else:
            fire_context = "\n\n(Real-time fire data temporarily unavailable)\n\n"

        # Default intro message
        if not user_question:
            user_question = (
                "Introduce yourself as Williams, a wildfire safety assistant AI. "
                "Greet the user warmly and let them know you have access to real-time NASA satellite fire data."
            )

        # Build enhanced prompt with fire context
        prompt = f"""
        You are Williams, a wildfire safety assistant AI with access to REAL-TIME NASA FIRMS satellite fire detection data.

        You speak clearly, warmly, and like a caring emergency preparedness expert.
        Your ONLY job is to provide wildfire safety advice based on ACTUAL current fire conditions.

        {fire_context}

        User's location: {latitude}, {longitude}

        STRICT TOPIC RESTRICTIONS:
        - ONLY answer questions about: wildfires, fire safety, evacuation, emergency preparedness, air quality from smoke, fire prevention, home protection from fires
        - DO NOT answer questions about: general knowledge, math, coding, other disasters, weather (unless related to fire risk), politics, entertainment, or ANY topic unrelated to wildfires
        - If the user asks an off-topic question, respond EXACTLY with: "I'm Williams, a wildfire safety assistant. I'm specifically designed to help with wildfire safety, evacuation planning, and fire preparedness. I can't help with other topics. How can I assist you with wildfire safety today?"

        RESPONSE GUIDELINES (only for wildfire-related questions):
        - If fires are nearby (within 50 miles), emphasize urgency and provide immediate safety steps
        - If fires are 50-100 miles away, provide preparation and monitoring advice
        - If no fires nearby, provide general wildfire preparedness information
        - Always mention that your data comes from NASA FIRMS satellite detection
        - Be specific about distances and directions when mentioning fires
        - Keep responses concise and actionable

        User's question: {user_question}

        Remember: If this question is NOT about wildfires or fire safety, politely decline and redirect!
        """

        try:
            response = model.generate_content(prompt)
            reply_text = response.text

            # Cache intro message to save API calls (1 hour)
            if not user_question:
                cache.set("williams_intro_message", reply_text, 3600)

            return JsonResponse({"reply": reply_text})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST allowed."}, status=405)


# Helper function: Get cardinal direction
def get_direction(lat1, lon1, lat2, lon2):
    """Calculate cardinal direction from point 1 to point 2"""
    dlon = lon2 - lon1
    dlat = lat2 - lat1

    # Calculate bearing
    import math
    bearing = math.atan2(dlon, dlat)
    bearing = math.degrees(bearing)
    bearing = (bearing + 360) % 360

    # Convert to cardinal direction
    directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    index = round(bearing / 45) % 8
    return directions[index]


# NASA FIRMS API - Get live fire data
@csrf_exempt
def get_fires(request):
    """
    Fetch live wildfire data from NASA FIRMS API
    Returns GeoJSON format for map visualization
    Cached for 1 hour to avoid rate limits
    """

    # Check cache first (1 hour cache)
    cache_key = 'nasa_firms_fires'
    cached_data = cache.get(cache_key)

    if cached_data:
        return JsonResponse(cached_data, safe=False)

    try:
        # Get API key from environment
        map_key = os.getenv("MAP_KEY")
        if not map_key:
            return JsonResponse({"error": "MAP_KEY not configured"}, status=500)

        # NASA FIRMS API - Get last 10 days of fires in USA
        # Using VIIRS_SNPP_NRT (near real-time satellite data)
        days = 10  # Last 10 days (winter might have fewer fires)
        url = f"https://firms.modaps.eosdis.nasa.gov/api/country/csv/{map_key}/VIIRS_SNPP_NRT/USA/{days}"

        # Fetch data from NASA
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        # Parse CSV data
        df = pd.read_csv(StringIO(response.text))

        # Convert to GeoJSON format
        features = []
        for _, row in df.iterrows():
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(row['longitude']), float(row['latitude'])]
                },
                "properties": {
                    "brightness": float(row['bright_ti4']) if 'bright_ti4' in row else None,
                    "confidence": str(row['confidence']) if 'confidence' in row else 'unknown',
                    "acq_date": str(row['acq_date']) if 'acq_date' in row else 'unknown',
                    "acq_time": str(row['acq_time']) if 'acq_time' in row else 'unknown',
                    "satellite": str(row['satellite']) if 'satellite' in row else 'VIIRS',
                    "frp": float(row['frp']) if 'frp' in row else None  # Fire Radiative Power
                }
            }
            features.append(feature)

        geojson_data = {
            "type": "FeatureCollection",
            "features": features,
            "metadata": {
                "count": len(features),
                "days": days,
                "source": "NASA FIRMS VIIRS",
                "updated": pd.Timestamp.now().isoformat()
            }
        }

        # Cache for 1 hour (3600 seconds)
        cache.set(cache_key, geojson_data, 3600)

        return JsonResponse(geojson_data, safe=False)

    except requests.RequestException as e:
        return JsonResponse({"error": f"Failed to fetch fire data: {str(e)}"}, status=500)
    except Exception as e:
        return JsonResponse({"error": f"Error processing fire data: {str(e)}"}, status=500)

