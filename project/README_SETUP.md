# Williams Wildfire Safety Chatbot - Setup Guide

This guide will help you set up and run the Williams Wildfire Safety Chatbot with its new React frontend and Django backend.

## Architecture

- **Backend**: Django 5.2 REST API (Port 8000)
- **Frontend**: React + Vite (Port 5173)
- **Communication**: CORS-enabled REST API

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed
- Git (for cloning/updating)

## Initial Setup

### 1. Backend Setup (Django)

Navigate to the project directory:
```bash
cd project
```

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Django 5.2
- django-cors-headers
- pandas
- geopandas
- shapely
- google-generativeai
- python-dotenv

#### Configure Environment Variables

The `.env` file has already been created with your Gemini API key. If you need to update it:

```bash
# Edit .env file
GEMINI_API_KEY=your_api_key_here
```

#### Run Database Migrations (Optional)

```bash
python manage.py migrate
```

### 2. Frontend Setup (React)

Navigate to the frontend directory:
```bash
cd frontend
```

#### Install Node Dependencies

```bash
npm install
```

This will install:
- React 18
- Vite
- Leaflet & React-Leaflet (for maps)
- Axios (for API calls)

## Running the Application

You need to run **both** the backend and frontend servers simultaneously.

### Terminal 1: Start Django Backend

```bash
cd project
python manage.py runserver
```

The backend will start at: **http://localhost:8000**

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

### Terminal 2: Start React Frontend

```bash
cd project/frontend
npm run dev
```

The frontend will start at: **http://localhost:5173**

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## How It Works

1. **React frontend** (port 5173) displays the UI with:
   - Interactive fire map using Leaflet
   - Chat interface for asking Williams questions
   - User geolocation detection

2. **Django backend** (port 8000) provides:
   - `/ask/` API endpoint for chatbot queries
   - Google Gemini AI integration for responses
   - Fire data processing

3. **Communication**:
   - Frontend makes API calls to `http://localhost:8000/ask/`
   - CORS headers allow cross-origin requests during development

## Project Structure

```
project/
├── manage.py                    # Django management
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables (API keys)
├── .gitignore                   # Git ignore rules
│
├── website/                     # Django project settings
│   ├── settings.py              # Django config (with CORS)
│   └── urls.py                  # URL routing
│
├── chatbot/                     # Django app
│   ├── views.py                 # API endpoints
│   ├── urls.py                  # App URLs
│   ├── static/                  # Static files (GeoJSON, CSV)
│   └── fire_data/               # Fire CSV data
│
└── frontend/                    # React app
    ├── package.json             # Node dependencies
    ├── vite.config.js           # Vite configuration
    │
    ├── public/
    │   └── fires.geojson        # Fire data (37MB)
    │
    └── src/
        ├── App.jsx              # Main component
        ├── App.css              # Styles
        ├── components/
        │   ├── FireMap.jsx      # Map component
        │   ├── ChatBox.jsx      # Chat display
        │   └── ChatInput.jsx    # Input field
        └── services/
            └── api.js           # API client
```

## API Endpoints

### POST /ask/
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
  "reply": "Williams' response here..."
}
```

## Features

- Interactive fire map with real-time user location
- AI-powered chatbot using Google Gemini
- Geolocation-aware responses
- Responsive design (mobile-friendly)
- Auto-intro message on page load
- Visualization of 2023 wildfire data

## Troubleshooting

### Port Already in Use

If port 8000 or 5173 is already in use:

**Backend:**
```bash
python manage.py runserver 8001
```
Then update `frontend/src/services/api.js` to use port 8001.

**Frontend:**
```bash
npm run dev -- --port 5174
```

### CORS Errors

Make sure both servers are running and CORS is configured in `website/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### Geolocation Not Working

- Ensure you're using HTTPS or localhost
- Allow location permissions in your browser
- Check browser console for errors

### Map Not Loading

- Verify `fires.geojson` exists in `frontend/public/`
- Check browser console for network errors
- Ensure file is accessible (37MB file might take time to load)

## Development Tips

### Hot Reload

Both servers support hot reload:
- **Django**: Auto-reloads on Python file changes
- **Vite**: Instant HMR (Hot Module Replacement) on React file changes

### Environment Variables

Never commit `.env` files with real API keys. Use `.env.example` for templates.

### Building for Production

To create a production build of the frontend:
```bash
cd frontend
npm run build
```

This creates optimized files in `frontend/dist/`.

## Next Steps

After getting the app running, consider:

1. **Live Data Integration**: Connect to NASA FIRMS API for real-time fire data
2. **Database Models**: Add chat history, user profiles
3. **Authentication**: Implement user accounts
4. **Testing**: Add unit and integration tests
5. **Deployment**: Deploy to platforms like Vercel (frontend) + Heroku (backend)

## Support

If you encounter issues:
1. Check that both servers are running
2. Verify all dependencies are installed
3. Check browser console for errors
4. Ensure `.env` file exists with valid API key

## License

MIT License - See LICENSE file for details
