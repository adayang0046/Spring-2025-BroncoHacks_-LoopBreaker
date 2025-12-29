#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Build React frontend
cd frontend
npm install
npm run build
cd ..

# Run Django migrations
python manage.py migrate

# Collect static files (if needed in future)
# python manage.py collectstatic --no-input
