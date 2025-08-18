
# Environmental Monitoring Web Application - Local Deployment

## Quick Start Guide

This application can be downloaded and run on any local machine with Python 3.8+.

### Option 1: Automated Setup (Recommended)

1. **Download the application**
   - Download all files in the `GeoSphereView` folder
   - Place them in a new directory on your local machine

2. **Run the setup script**
   ```bash
   python setup_local_complete.py
   ```

3. **Start the application**
   ```bash
   python start_app.py
   ```

4. **Access the application**
   - Open browser to: http://localhost:5000
   - Demo login: demo@munisat.com / demo123

### Option 2: Manual Setup

1. **Install Python dependencies**
   ```bash
   pip install -r requirements_local.txt
   ```

2. **Create necessary directories**
   ```bash
   mkdir -p uploads models instance logs static/css static/js static/images
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file as needed
   ```

4. **Initialize database**
   ```bash
   python -c "from app import app, db; app.app_context().push(); db.create_all()"
   ```

5. **Start the application**
   ```bash
   python app.py
   ```

## System Requirements

- **Python**: 3.8 or higher
- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: 500MB free space
- **Network**: Internet connection for initial setup

## File Structure

```
environmental-monitoring-app/
├── app.py                    # Main Flask application
├── ml_models.py             # Machine learning integration
├── start_app.py             # Easy startup script
├── setup_local_complete.py  # Complete setup script
├── requirements_local.txt   # Python dependencies
├── .env                     # Environment configuration
├── templates/               # HTML templates
├── static/                  # CSS, JS, images
├── uploads/                 # User uploaded images
├── models/                  # ML model files
├── instance/                # SQLite database
└── logs/                    # Application logs
```

## Configuration

### Database
- **Development**: SQLite (default) - `sqlite:///instance/munisat.db`
- **Production**: PostgreSQL recommended

### Environment Variables (.env file)
```env
DATABASE_URL=sqlite:///instance/munisat.db
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
FLASK_DEBUG=True
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
HOST=0.0.0.0
PORT=5000
```

## Adding Your ML Models

1. **Place model files** in the `models/` directory
2. **Update ml_models.py** with your model loading code:
   ```python
   def load_models(self):
       import tensorflow as tf
       self.models['informal_settlements'] = tf.keras.models.load_model('models/your_model.h5')
   ```

## Features

- ✅ User authentication and registration
- ✅ Image upload and processing
- ✅ Environmental detection (mock implementation)
- ✅ Interactive dashboard
- ✅ Analysis results viewing
- ✅ Report generation
- ✅ SQLite database (easily portable)
- ✅ Responsive web interface

## Production Deployment

### Using Gunicorn (Linux/macOS)
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Waitress (Windows)
```bash
pip install waitress
waitress-serve --host=0.0.0.0 --port=5000 app:app
```

### Environment Setup for Production
1. Change `SECRET_KEY` in .env to a secure random string
2. Set `FLASK_ENV=production` and `FLASK_DEBUG=False`
3. Configure PostgreSQL database for better performance
4. Set up proper web server (nginx + gunicorn)

## Common Issues & Solutions

### Port 5000 already in use
```bash
# Find process using port 5000
netstat -tulpn | grep :5000

# Kill the process or use different port
export PORT=8000
python app.py
```

### Permission errors on uploads folder
```bash
chmod 755 uploads
```

### Database errors
```bash
# Reset database
rm instance/munisat.db
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### Missing dependencies
```bash
pip install --upgrade pip
pip install -r requirements_local.txt
```

## Default Credentials

- **Email**: demo@munisat.com
- **Password**: demo123

## Support

The application is self-contained and runs entirely offline once set up. All dependencies are included in the requirements file.

## License

MIT License - Free for commercial and personal use.
