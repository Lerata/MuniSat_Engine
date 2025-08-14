
#!/usr/bin/env python3
"""
Replit Startup Script
Environmental Monitoring Web Application
"""

import os
import sys
from app import app, db

def setup_replit_environment():
    """Setup environment for Replit"""
    # Set environment variables
    os.environ['DATABASE_URL'] = 'sqlite:///instance/munisat.db'
    os.environ['SECRET_KEY'] = 'replit-dev-secret-key'
    os.environ['FLASK_ENV'] = 'development'
    os.environ['FLASK_DEBUG'] = 'True'
    
    print("Environment configured for Replit")

def create_directories():
    """Create necessary directories"""
    directories = [
        'uploads', 'models', 'instance', 'logs',
        'static/css', 'static/js', 'static/images'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
    
    print("Directories created")

def initialize_database():
    """Initialize the database"""
    try:
        with app.app_context():
            db.create_all()
            print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization error: {str(e)}")

if __name__ == '__main__':
    print("="*50)
    print("Environmental Monitoring Web Application")
    print("Running on Replit")
    print("="*50)
    
    # Setup
    setup_replit_environment()
    create_directories()
    initialize_database()
    
    print("\nStarting application...")
    print("Access at the Replit preview URL")
    
    # Run the application
    app.run(host='0.0.0.0', port=5000, debug=True)
