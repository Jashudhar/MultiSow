# Deployment Guide - MultiSow Crop Management System

## Quick Start

### Option 1: Docker (Recommended)
```bash
docker-compose up -d
```
Access at: http://localhost:8000

### Option 2: Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Option 3: Windows Batch Script
Double-click `run.bat` to start the server automatically.

## Production Deployment

### Environment Variables
- `ENVIRONMENT`: Set to "production" for production mode
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

### Docker Production Build
```bash
docker build -t multisow:latest .
docker run -d -p 8000:8000 \
  -e ENVIRONMENT=production \
  -e ALLOWED_ORIGINS=https://yourdomain.com \
  multisow:latest
```

### Health Check
Visit `/health` endpoint to verify server status:
```bash
curl http://localhost:8000/health
```

## Features
- Consolidated CSS and JavaScript files
- Optimized for production
- Docker support
- All buttons and sections functional
- Responsive design
- Modern UI with animations

