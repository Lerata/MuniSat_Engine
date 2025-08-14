
@echo off
echo ==================================================
echo Environmental Monitoring Web Application Setup
echo ==================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)

echo [INFO] Python version:
python --version

REM Create virtual environment
echo [INFO] Creating virtual environment...
if not exist venv (
    python -m venv venv
    echo [INFO] Virtual environment created
) else (
    echo [WARNING] Virtual environment already exists
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo [INFO] Installing Python dependencies...
if exist requirements.txt (
    pip install -r requirements.txt
    echo [INFO] Dependencies installed successfully
) else (
    echo [ERROR] requirements.txt not found!
    pause
    exit /b 1
)

REM Create necessary directories
echo [INFO] Creating necessary directories...
mkdir uploads 2>nul
mkdir models 2>nul
mkdir "static\css" 2>nul
mkdir "static\js" 2>nul  
mkdir "static\images" 2>nul
mkdir instance 2>nul
mkdir logs 2>nul
echo [INFO] Directories created

REM Create .env file if it doesn't exist
if not exist .env (
    echo [INFO] Creating .env file...
    echo # Database Configuration > .env
    echo DATABASE_URL=sqlite:///instance/munisat.db >> .env
    echo SQLALCHEMY_DATABASE_URI=sqlite:///instance/munisat.db >> .env
    echo. >> .env
    echo # Security >> .env
    echo SECRET_KEY=dev-secret-key-change-in-production >> .env
    echo. >> .env
    echo # Flask Configuration >> .env
    echo FLASK_ENV=development >> .env
    echo FLASK_DEBUG=True >> .env
    echo. >> .env
    echo # Upload Configuration >> .env
    echo UPLOAD_FOLDER=uploads >> .env
    echo MAX_CONTENT_LENGTH=16777216 >> .env
    echo. >> .env
    echo # Server Configuration >> .env
    echo HOST=0.0.0.0 >> .env
    echo PORT=5000 >> .env
    echo. >> .env
    echo # ML Model Configuration >> .env
    echo MODEL_PATH=models/ >> .env
    echo. >> .env
    echo # Logging >> .env
    echo LOG_LEVEL=DEBUG >> .env
    echo LOG_FILE=logs/app.log >> .env
    echo [INFO] .env file created
) else (
    echo [WARNING] .env file already exists
)

REM Initialize database
echo [INFO] Initializing database...
set FLASK_APP=app.py
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database initialized')" 2>nul || echo [WARNING] Database initialization completed

REM Create model directory structure
echo [INFO] Setting up model directory structure...
mkdir "models\informal_settlements" 2>nul
mkdir "models\waste_management" 2>nul
mkdir "models\water_quality" 2>nul
mkdir "models\deforestation" 2>nul
mkdir "models\flood_assessment" 2>nul

echo # ML Models Directory > models\README.md
echo. >> models\README.md
echo Place your trained machine learning models in the respective subdirectories: >> models\README.md
echo. >> models\README.md
echo - informal_settlements/ - Models for detecting informal settlements >> models\README.md
echo - waste_management/ - Models for waste and dumping site detection >> models\README.md
echo - water_quality/ - Models for water quality assessment >> models\README.md
echo - deforestation/ - Models for forest cover analysis >> models\README.md
echo - flood_assessment/ - Models for flood risk evaluation >> models\README.md
echo. >> models\README.md
echo Supported formats: .h5, .pkl, .joblib, .pt, .pth, .onnx >> models\README.md

echo [INFO] Setup complete!
echo.
echo ==================================================
echo Next Steps:
echo ==================================================
echo 1. Activate the virtual environment:
echo    venv\Scripts\activate.bat
echo.
echo 2. Start the development server:
echo    python run_local.py
echo.
echo 3. Open your browser to:
echo    http://localhost:5000
echo.
echo 4. For production deployment:
echo    - Update the SECRET_KEY in .env
echo    - Configure a proper database (PostgreSQL recommended)
echo    - Add your ML models to the models\ directory
echo    - Update ml_models.py with your actual model code
echo.
echo ==================================================
echo Environment Setup Complete!
echo ==================================================
pause
