@echo off
echo Setting up Municipal Satellite Analysis Application...

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate

REM Install dependencies
pip install -r local_requirements.txt

REM Create necessary directories
mkdir uploads models static\css static\js static\images 2>nul
mkdir instance 2>nul
mkdir logs 2>nul

REM Create environment file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    echo DATABASE_URL=sqlite:///instance/munisat.db > .env
    echo SECRET_KEY=dev-secret-key-change-in-production >> .env
    echo FLASK_ENV=development >> .env
    echo FLASK_DEBUG=True >> .env
    echo UPLOAD_FOLDER=uploads >> .env
    echo MAX_CONTENT_LENGTH=16777216 >> .env
)

REM Initialize database
set FLASK_APP=app.py
flask db init 2>nul || echo Database already initialized
flask db migrate -m "Initial migration" 2>nul || echo Migration exists
flask db upgrade 2>nul || echo Database already up to date

echo Setup complete!
echo To start the application:
echo 1. Activate virtual environment: venv\Scripts\activate
echo 2. Run the application: python app.py
echo 3. Open browser to http://localhost:5000
pause
