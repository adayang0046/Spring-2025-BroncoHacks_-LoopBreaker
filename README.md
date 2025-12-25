# 🔥 Williams: Your Wildfire Safety Chat Assistant

Williams is an AI-powered wildfire safety chatbot designed to help people stay informed and prepared for wildfires. Built as a full-stack React application with Django REST API backend, it provides instant, location-aware answers to fire safety questions.

## 💡 What It Does

- 💬 **AI-Powered Chat**: Instant answers to wildfire safety questions using Google Gemini AI
- 🎨 **Modern UI**: Clean, responsive React interface with Williams mascot branding
- 🧳 **Safety Guidance**: Evacuation checklists, preparation steps, and emergency tips
- 🔥 **Fire Data Visualization (disabled for now)**: Interactive map with NASA MODIS wildfire detection data (2023) 
<img width="1806" height="731" alt="image" src="https://github.com/user-attachments/assets/4f92bd6f-7937-4589-aa34-9dc1e1b081cf" />

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Leaflet.js** & React-Leaflet for interactive mapping
- **Axios** for API communication
- **Responsive Design** - works on desktop and mobile

### Backend
- **Django 5.2** REST API
- **Google Gemini 2.5 Flash** for AI responses
- **Django CORS Headers** for API security
- **pandas** & **geopandas** for fire data processing

### Architecture
- Separated frontend/backend with RESTful API
- Single server deployment (Django serves React build)
- Environment-based configuration with `.env`

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Google Gemini API key ([Get one free here](https://aistudio.google.com/app/apikey))

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

# Create .env file with your API key
echo "GEMINI_API_KEY=your_api_key_here" > .env

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
- Full-stack React + Django architecture
- AI chatbot with Google Gemini integration
- Geolocation-aware responses
- Responsive UI with Williams mascot branding
- RESTful API design
- Environment-based configuration

### Planned Features 🚧
- Live NASA FIRMS API integration for real-time fire data
- Interactive fire map with marker clustering
- User authentication and chat history
- Push notifications for nearby wildfires
- Multi-language support

## 🎬 Demo

**Youtube Demo:**
https://www.youtube.com/watch?v=ckXT8EOiVPg

## 📝 API Endpoints

### POST `/api/ask/`
Ask Williams a wildfire safety question.

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
  "reply": "If a wildfire is approaching, you should..."
}
```

This project was created for Spring 2025 BroncoHacks. Future work is planning.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **Google Gemini** for AI capabilities
- **NASA MODIS** for wildfire detection data
- **Leaflet.js** for mapping
- **BroncoHacks 2025** for the inspiration

---

**Built by the LoopBreaker Team**
