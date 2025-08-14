#!/bin/bash
echo "Setting up Municipal Satellite Analysis Application..."

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r local_requirements.txt

# Create necessary directories
mkdir -p uploads models static/css static/js static/images
mkdir -p instance
mkdir -p logs

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
DATABASE_URL=sqlite:///instance/munisat.db
SECRET_KEY=dev-secret-key-change-in-production
FLASK_ENV=development
FLASK_DEBUG=True
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
EOL
fi

# Initialize database
export FLASK_APP=app.py
flask db init 2>/dev/null || echo "Database already initialized"
flask db migrate -m "Initial migration" 2>/dev/null || echo "Migration exists"
flask db upgrade 2>/dev/null || echo "Database already up to date"

echo "Setup complete!"
echo "To start the application:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Run the application: python app.py"
echo "3. Open browser to http://localhost:5000"