
@echo off
echo ============================================================
echo Environmental Monitoring Web Application - Local Setup
echo ============================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo [INFO] Python found:
python --version

REM Install dependencies
echo [INFO] Installing dependencies...
pip install -r requirements_local.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

REM Create directories
echo [INFO] Creating directories...
mkdir uploads 2>nul
mkdir models 2>nul
mkdir instance 2>nul
mkdir logs 2>nul
mkdir static\css 2>nul
mkdir static\js 2>nul
mkdir static\images 2>nul

REM Create .env file
if not exist .env (
    echo [INFO] Creating .env file...
    echo DATABASE_URL=sqlite:///instance/munisat.db > .env
    echo SECRET_KEY=local-development-secret-key >> .env
    echo FLASK_ENV=development >> .env
    echo FLASK_DEBUG=True >> .env
    echo UPLOAD_FOLDER=uploads >> .env
    echo MAX_CONTENT_LENGTH=16777216 >> .env
    echo HOST=0.0.0.0 >> .env
    echo PORT=5000 >> .env
)

REM Initialize database
echo [INFO] Initializing database...
python -c "from app import app, db; app.app_context().push(); db.create_all()" 2>nul

echo [SUCCESS] Setup complete!
echo.
echo To start the application:
echo   python app.py
echo.
echo Access at: http://localhost:5000
echo Demo login: demo@munisat.com / demo123
echo.
pause
