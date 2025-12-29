# 🔥 Williams: Your Wildfire Safety Chat Assistant

Williams is an AI-powered wildfire safety chatbot designed to help people stay informed and prepared for wildfires. Built as a full-stack React application with Django REST API backend, it provides instant, location-aware answers to fire safety questions.

## 💡 What It Does

- 💬 **Fire-Aware AI Chat**: Instant, location-aware answers using Google Gemini AI with real-time fire data
- 🗺️ **Live Fire Map**: Interactive map showing active wildfires from NASA FIRMS satellite detection (updated hourly)
- 📍 **Proximity Warnings**: Williams calculates distances to nearby fires and provides urgent safety advice
- 🎨 **Modern UI**: Clean, responsive React interface with Williams mascot branding
- 🧳 **Safety Guidance**: Evacuation checklists, preparation steps, and emergency tips based on actual fire conditions 


## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Leaflet.js** & React-Leaflet for interactive mapping
- **Axios** for API communication
- **Responsive Design** - works on desktop and mobile

### Backend
- **Django 5.2** REST API
- **Google Gemini 2.5 Flash** for fire-aware AI responses
- **NASA FIRMS API** for real-time wildfire satellite data (VIIRS)
- **Django CORS Headers** for API security
- **pandas** for fire data processing and geospatial calculations
- **Django Caching** for API rate limit management (1-hour cache)

### Architecture
- Separated frontend/backend with RESTful API
- Single server deployment (Django serves React build)
- Environment-based configuration with `.env`

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Google Gemini API key ([Get one free here](https://aistudio.google.com/app/apikey))
- NASA FIRMS MAP_KEY ([Request free access here](https://firms.modaps.eosdis.nasa.gov/api/map_key))

### Setup

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/Spring-2025-BroncoHacks_-LoopBreaker.git
cd Spring-2025-BroncoHacks_-LoopBreaker/project
```

**2. Backend Setup**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Create .env file with your API keys
echo "GEMINI_API_KEY=your_gemini_key_here" > .env
echo "MAP_KEY=your_nasa_firms_key_here" >> .env

# Run migrations
python manage.py migrate
```

**3. Frontend Setup**
```bash
cd frontend
npm install
npm run build
cd ..
```

**4. Run the Application**
```bash
# Start Django server (serves both frontend and API)
python manage.py runserver
```

Open http://localhost:8000 in your browser


## 🎯 Features

### Current Features ✅
- **Full-stack React + Django architecture** - Modern separation of concerns
- **Fire-Aware AI** - Williams analyzes live NASA satellite data and provides proximity-based advice
- **Real-time Fire Map** - Interactive Leaflet.js map with active wildfire markers from NASA FIRMS VIIRS
- **Proximity Calculations** - Haversine distance calculations to fires within 100 miles
- **Geolocation Integration** - Browser geolocation API for location-aware responses
- **Topic Restriction** - Cost-optimized AI that only responds to wildfire-related questions
- **Responsive UI** - Works perfectly on desktop and mobile with Williams mascot branding
- **RESTful API design** - Clean `/api/ask/` and `/api/fires/` endpoints
- **Caching Strategy** - 1-hour cache for NASA API to avoid rate limits

### Planned Features 🚧
- Marker clustering for dense fire areas
- User authentication and chat history persistence
- Push notifications for nearby wildfires
- Multi-language support (Spanish, etc.)
- Historical fire data analysis and trends

## 🎬 Demo

**Youtube Demo:**
https://www.youtube.com/watch?v=ckXT8EOiVPg

## 📝 API Endpoints

### POST `/api/ask/`
Ask Williams a wildfire safety question with location-aware, fire-proximity analysis.

**Request:**
```json
{
  "question": "What should I do during a wildfire?",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

**Response:**
```json
{
  "reply": "⚠️ Based on NASA satellite data, there are 3 active fires within 100 miles of your location. The closest fire is 23.4 miles northeast. Here's what you should do immediately: [detailed safety advice]"
}
```

### GET `/api/fires/`
Get live wildfire data from NASA FIRMS (last 10 days, USA).

**Response:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.4194, 37.7749]
      },
      "properties": {
        "confidence": "high",
        "acq_date": "2025-12-28",
        "acq_time": "1430",
        "satellite": "VIIRS",
        "frp": 45.2
      }
    }
  ],
  "metadata": {
    "count": 150,
    "days": 10,
    "source": "NASA FIRMS VIIRS",
    "updated": "2025-12-28T14:30:00"
  }
}
```

This project was created for Spring 2025 BroncoHacks. Future work is planning.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **Google Gemini 2.5 Flash** for AI capabilities
- **NASA FIRMS (Fire Information for Resource Management System)** for real-time VIIRS satellite wildfire detection data
- **Leaflet.js** for interactive mapping
- **BroncoHacks 2025** for the inspiration

---

**Built by the LoopBreaker Team**
