@echo off
REM ============================================================
REM MultiSow - Single-Click Launcher
REM Double-click this file to start the application
REM ============================================================

cd /d "%~dp0"
echo.
echo ============================================================
echo    MultiSow - Multi-Tier Crop Management System
echo ============================================================
echo.

REM Check Python
py --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed!
    echo Please install Python 3.8+ from https://www.python.org/
    echo.
    pause
    exit /b 1
)

REM Install Python dependencies
echo [1/3] Installing Python dependencies...
py -m pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)

REM Check if Node.js is available (optional, for npx tools)
node --version >nul 2>&1
if errorlevel 1 (
    echo [NOTE] Node.js not found - starting backend only
    echo        Install Node.js for auto-browser opening feature
    echo.
    echo [2/3] Starting backend server...
    echo.
    echo   Application: http://localhost:8000/frontend/
    echo   API Docs:    http://localhost:8000/docs
    echo.
    echo   Press CTRL+C to stop the server
    echo ============================================================
    echo.
    py -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
    pause
    exit /b 0
)

echo [2/3] Starting application...
echo.
echo   Application: http://localhost:8000/frontend/
echo   API Docs:    http://localhost:8000/docs
echo.
echo   Browser will open automatically when ready.
echo   Press CTRL+C to stop the server.
echo ============================================================
echo.

REM Start backend and wait for it, then open browser
start /b py -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

REM Wait for server to be ready, then open browser
echo [3/3] Waiting for server to start...
:waitloop
timeout /t 1 /nobreak >nul
py -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" >nul 2>&1
if errorlevel 1 goto waitloop

echo Server ready! Opening browser...
start http://localhost:8000/frontend/home.html

REM Keep window open to show server logs
echo.
echo Server is running. Close this window to stop.
cmd /k
