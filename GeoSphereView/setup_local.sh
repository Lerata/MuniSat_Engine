
#!/bin/bash

echo "=================================================="
echo "Environmental Monitoring Web Application Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Python version
print_status "Checking Python version..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    print_status "Python version: $PYTHON_VERSION"
else
    print_error "Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Create virtual environment
print_status "Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_status "Virtual environment created"
else
    print_warning "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip

# Install requirements
print_status "Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    print_status "Dependencies installed successfully"
else
    print_error "requirements.txt not found!"
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p uploads models static/css static/js static/images instance logs
print_status "Directories created"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOL
# Database Configuration
DATABASE_URL=sqlite:///instance/munisat.db
SQLALCHEMY_DATABASE_URI=sqlite:///instance/munisat.db

# Security
SECRET_KEY=dev-secret-key-change-in-production-$(openssl rand -hex 16)

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216

# Server Configuration
HOST=0.0.0.0
PORT=5000

# ML Model Configuration
MODEL_PATH=models/

# Logging
LOG_LEVEL=DEBUG
LOG_FILE=logs/app.log
EOL
    print_status ".env file created"
else
    print_warning ".env file already exists"
fi

# Initialize database
print_status "Initializing database..."
export FLASK_APP=app.py
python3 -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('Database tables created successfully')
" 2>/dev/null || print_warning "Database initialization completed with warnings"

# Create sample model directory structure
print_status "Setting up model directory structure..."
mkdir -p models/informal_settlements models/waste_management models/water_quality models/deforestation models/flood_assessment
touch models/README.md
cat > models/README.md << EOL
# ML Models Directory

Place your trained machine learning models in the respective subdirectories:

- informal_settlements/ - Models for detecting informal settlements
- waste_management/ - Models for waste and dumping site detection  
- water_quality/ - Models for water quality assessment
- deforestation/ - Models for forest cover analysis
- flood_assessment/ - Models for flood risk evaluation

Supported formats: .h5, .pkl, .joblib, .pt, .pth, .onnx
EOL

print_status "Setup complete!"
echo ""
echo "=================================================="
echo "Next Steps:"
echo "=================================================="
echo "1. Activate the virtual environment:"
echo "   source venv/bin/activate"
echo ""
echo "2. Start the development server:"
echo "   python3 run_local.py"
echo ""
echo "3. Open your browser to:"
echo "   http://localhost:5000"
echo ""
echo "4. For production deployment:"
echo "   - Update the SECRET_KEY in .env"
echo "   - Configure a proper database (PostgreSQL recommended)"
echo "   - Add your ML models to the models/ directory"
echo "   - Update ml_models.py with your actual model code"
echo ""
echo "=================================================="
echo "Environment Setup Complete!"
echo "=================================================="
