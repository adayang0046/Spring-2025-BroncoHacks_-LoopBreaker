# Option: Serve React from Django (Combined Server)

This combines frontend and backend into one server running on port 8000.

## Steps to Combine:

### 1. Build React for Production
```bash
cd frontend
npm run build
```
This creates an optimized `frontend/dist/` folder.

### 2. Update Django Settings

Add to `website/settings.py`:
```python
import os

# Add this near STATIC_URL
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Serve React build files
STATICFILES_DIRS = [
    BASE_DIR / "chatbot" / "static",
    BASE_DIR / "frontend" / "dist",  # React build
]

# Serve React's index.html as fallback
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'frontend' / 'dist'],  # Add React dist
        'APP_DIRS': True,
        ...
    },
]
```

### 3. Update URLs

Update `website/urls.py`:
```python
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("chatbot.urls")),  # API routes with /api/ prefix
    path('', TemplateView.as_view(template_name='index.html')),  # React app
]
```

### 4. Update React API URL

Update `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = '/api';  // Remove http://localhost:8000
```

### 5. Run Combined Server
```bash
cd project
python manage.py collectstatic --noinput
python manage.py runserver
```

Now open: **http://localhost:8000** - everything works from one server!

## Benefits:
- ✅ Only one server to run
- ✅ No CORS issues
- ✅ Easier deployment
- ✅ Production-ready setup
