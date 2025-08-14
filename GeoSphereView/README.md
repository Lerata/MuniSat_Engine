
# Environmental Monitoring Web Application

## Overview

A comprehensive web application for environmental monitoring using satellite imagery analysis. The platform enables governments, NGOs, and urban planners to detect, track, and respond to environmental changes including informal settlements, waste management issues, water quality monitoring, forest protection, and flood risk assessment.

## Features

### Core Detection Capabilities
- **Informal Settlement Growth** - Identify unauthorized residential developments
- **Illegal Dumping Sites** - Detect unauthorized waste disposal areas  
- **Water Source Pollution** - Track contamination and water quality changes
- **Deforestation Activities** - Monitor tree cover loss and vegetation changes
- **Flood-Prone Zone Assessment** - Evaluate areas susceptible to flooding

### Web Application Features
- User authentication and session management
- Interactive dashboard with real-time statistics
- Image upload with drag-and-drop interface
- Advanced analysis results visualization
- Comprehensive reporting system
- Export functionality (PDF, CSV, KML)
- Role-based access control
- Mobile-responsive design

## Quick Start

### Option 1: Automated Setup (Recommended)

**For Linux/Mac:**
```bash
chmod +x setup_local.sh
./setup_local.sh
```

**For Windows:**
```cmd
setup_local.bat
```

### Option 2: Manual Setup

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd environmental-monitoring-app
```

2. **Create virtual environment**
```bash
python3 -m venv venv

# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Initialize database**
```bash
python3 -c "from app import app, db; app.app_context().push(); db.create_all()"
```

6. **Start the application**
```bash
python3 run_local.py
```

7. **Access the application**
Open browser to http://localhost:5000

## Project Structure

```
environmental-monitoring-app/
├── app.py                    # Main Flask application
├── run_local.py             # Local development server
├── ml_models.py             # Machine learning integration
├── requirements.txt         # Python dependencies
├── README.md               # This file
├── 
├── templates/              # HTML templates
│   ├── base.html
│   ├── index.html          # Landing page
│   ├── login.html          # User authentication
│   ├── register.html       # User registration
│   ├── dashboard.html      # Main dashboard
│   ├── upload.html         # Image upload interface
│   ├── analysis.html       # Analysis results
│   └── reports.html        # Reports and analytics
├── 
├── static/                 # Static files (auto-created)
│   ├── css/
│   ├── js/
│   └── images/
├── 
├── uploads/               # Uploaded images (auto-created)
├── models/               # ML model files (auto-created)
├── instance/             # Database files (auto-created)
├── logs/                 # Application logs (auto-created)
├── 
├── setup_local.sh        # Linux/Mac setup script
├── setup_local.bat       # Windows setup script
├── .env.example          # Environment variables template
├── Procfile             # Heroku deployment
└── runtime.txt          # Python version specification
```

## Database Configuration

### SQLite (Development)
Default configuration uses SQLite for easy local development:
```env
DATABASE_URL=sqlite:///instance/munisat.db
```

### PostgreSQL (Production)
For production deployment, use PostgreSQL:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/environmental_monitoring
```

## Machine Learning Integration

### Adding Your Models

1. **Place model files** in the `models/` directory:
```
models/
├── informal_settlements/
│   └── your_model.h5
├── waste_management/
│   └── your_model.h5
└── ...
```

2. **Update ml_models.py** with your model loading code:
```python
def load_models(self):
    import tensorflow as tf
    self.models['informal_settlements'] = tf.keras.models.load_model('models/informal_settlements/your_model.h5')
    # Add other models...
```

3. **Implement detection functions**:
```python
def detect_informal_settlements(self, image_path: str) -> Dict:
    processed_image = self.preprocess_image(image_path)
    model = self.models['informal_settlements']
    predictions = model.predict(processed_image)
    # Process predictions and return results
```

### Supported ML Frameworks
- TensorFlow/Keras
- PyTorch
- Scikit-learn
- ONNX models
- Custom implementations

## API Endpoints

### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `GET /logout` - User logout

### Core Functionality
- `GET /dashboard` - Main dashboard
- `POST /upload` - Image upload and analysis
- `GET /analysis` - View analysis results
- `GET /reports` - Reports and analytics

### API Routes
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/recent_detections` - Recent detection results

## Development

### Running Tests
```bash
pytest
```

### Code Structure
- `app.py` - Main Flask application with routes
- `ml_models.py` - ML integration (add your models here)
- `templates/` - HTML templates using Bootstrap 5
- Database models defined in `app.py`

### Adding New Detection Types
1. Add detection method to `EnvironmentalDetector` class
2. Update database schema if needed
3. Add UI elements in templates
4. Update API endpoints

## Deployment

### Local Development
```bash
python3 run_local.py
```

### Production Deployment

**Heroku:**
1. Install Heroku CLI
2. Create Heroku app
3. Add PostgreSQL addon
4. Set environment variables
5. Deploy:
```bash
git push heroku main
```

**Digital Ocean/AWS/GCP:**
1. Install dependencies on server
2. Configure PostgreSQL database
3. Set environment variables
4. Use gunicorn for production:
```bash
gunicorn app:app --bind 0.0.0.0:5000
```

### Environment Variables (Production)
```env
DATABASE_URL=postgresql://production-db-url
SECRET_KEY=your-secure-secret-key
FLASK_ENV=production
FLASK_DEBUG=False
```

## Usage Guide

### For Administrators
1. Register an admin account
2. Configure analysis parameters
3. Monitor system performance
4. Generate comprehensive reports

### For Analysts
1. Login to the system
2. Upload satellite images
3. Select analysis type
4. Review detection results
5. Export findings

### For Municipal Planners
1. Access dashboard for overview
2. Review priority alerts
3. Generate area-specific reports
4. Export data for planning tools

## Security Considerations

- Passwords are hashed using Werkzeug
- CSRF protection enabled
- File upload validation
- SQL injection prevention
- Session security
- Input sanitization

## Contributing

1. Fork the repository
2. Create feature branch
3. Add your ML models to `ml_models.py`
4. Test thoroughly
5. Submit pull request

## Troubleshooting

### Common Issues

**Database Connection Error:**
- Check DATABASE_URL in .env
- Ensure database server is running
- Verify credentials

**ML Model Loading Error:**
- Check model file paths
- Verify model format compatibility
- Update model loading code in ml_models.py

**Upload Failures:**
- Check UPLOAD_FOLDER permissions
- Verify MAX_CONTENT_LENGTH setting
- Ensure sufficient disk space

### Getting Help

1. Check logs in `logs/app.log`
2. Review console output
3. Verify environment configuration
4. Check database connectivity

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with Flask web framework
- Bootstrap 5 for responsive UI
- Chart.js for data visualization
- OpenCV for image processing
- TensorFlow for ML capabilities

---

**Ready for immediate download, local development, and deployment!**

The application is fully self-contained with no external dependencies on Replit or online services. All assets are included locally for offline development.
