#!/bin/bash
# ============================================================
# MultiSow - Single-Click Launcher (Mac/Linux)
# Run this file to start the application
# ============================================================

cd "$(dirname "$0")"

echo ""
echo "============================================================"
echo "   MultiSow - Multi-Tier Crop Management System"
echo "============================================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed!"
    echo "Please install Python 3.8+:"
    echo "  Ubuntu/Debian: sudo apt install python3 python3-pip"
    echo "  macOS: brew install python3"
    exit 1
fi

# Install Python dependencies
echo "[1/3] Installing Python dependencies..."
python3 -m pip install -r requirements.txt --quiet

if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install Python dependencies"
    exit 1
fi

echo "[2/3] Starting application..."
echo ""
echo "  Application: http://localhost:8000/frontend/"
echo "  API Docs:    http://localhost:8000/docs"
echo ""
echo "  Browser will open automatically when ready."
echo "  Press CTRL+C to stop the server."
echo "============================================================"
echo ""

# Start backend in background
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait for server to be ready
echo "[3/3] Waiting for server to start..."
while ! curl -s http://localhost:8000/health > /dev/null 2>&1; do
    sleep 1
done

echo "Server ready! Opening browser..."

# Open browser based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:8000/frontend/home.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8000/frontend/home.html
    fi
fi

# Wait for backend process
wait $BACKEND_PID
