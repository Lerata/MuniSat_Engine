
#!/usr/bin/env python3
"""
Replit Startup Script
Environmental Monitoring Web Application
"""

import os
import sys

def setup_replit_environment():
    """Setup environment for Replit"""
    # Set environment variables
    os.environ['DATABASE_URL'] = 'sqlite:///munisat.db'
    os.environ['SECRET_KEY'] = 'replit-dev-secret-key-change-in-production'
    os.environ['FLASK_ENV'] = 'development'
    os.environ['FLASK_DEBUG'] = 'True'
    os.environ['UPLOAD_FOLDER'] = 'uploads'
    os.environ['MAX_CONTENT_LENGTH'] = '16777216'
    
    print("Environment configured for Replit")

def create_directories():
    """Create necessary directories"""
    directories = [
        'uploads', 'models', 'instance', 'logs',
        'static/css', 'static/js', 'static/images'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        # Ensure proper permissions
        os.chmod(directory, 0o755)
    
    print("Directories created")

def initialize_database():
    """Initialize the database"""
    try:
        # Import app and db after environment is set up
        from app import app, db
        
        with app.app_context():
            db.create_all()
            print("Database initialized successfully")
            
        return app
    except Exception as e:
        print(f"Database initialization error: {str(e)}")
        raise

if __name__ == '__main__':
    print("="*50)
    print("Environmental Monitoring Web Application")
    print("Running on Replit")
    print("="*50)
    
    # Setup
    setup_replit_environment()
    create_directories()
    app = initialize_database()
    
    print("\nStarting application...")
    print("Access at the Replit preview URL")
    
    # Run the application
    app.run(host='0.0.0.0', port=5000, debug=True)
