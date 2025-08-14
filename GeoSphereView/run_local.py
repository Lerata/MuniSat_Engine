
#!/usr/bin/env python3
"""
Local Development Server
Environmental Monitoring Web Application
"""

import os
import sys
from app import app, db

def setup_environment():
    """Setup environment variables and configurations"""
    # Set default environment variables if not already set
    if not os.environ.get('DATABASE_URL'):
        os.environ['DATABASE_URL'] = 'sqlite:///instance/munisat.db'
    
    if not os.environ.get('SECRET_KEY'):
        os.environ['SECRET_KEY'] = 'dev-secret-key-change-in-production'
    
    if not os.environ.get('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    if not os.environ.get('FLASK_DEBUG'):
        os.environ['FLASK_DEBUG'] = 'True'
    
    print("Environment configured for local development")

def create_directories():
    """Create necessary directories"""
    directories = [
        'uploads',
        'models', 
        'instance',
        'logs',
        'static/css',
        'static/js',
        'static/images'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Directory created/verified: {directory}")

def initialize_database():
    """Initialize the database with tables"""
    try:
        with app.app_context():
            db.create_all()
            print("Database tables created successfully")
            
            # Check if there are any users
            from app import User
            user_count = User.query.count()
            print(f"Current user count: {user_count}")
            
            if user_count == 0:
                print("No users found. You can register the first user through the web interface.")
                
    except Exception as e:
        print(f"Database initialization error: {str(e)}")
        print("Make sure your database is properly configured")

def main():
    """Main function to start the local development server"""
    print("="*50)
    print("Environmental Monitoring Web Application")
    print("Local Development Server")
    print("="*50)
    
    # Setup environment
    setup_environment()
    
    # Create directories
    create_directories()
    
    # Initialize database
    initialize_database()
    
    print("\nStarting Flask development server...")
    print("Access the application at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    print("-"*50)
    
    try:
        # Run the Flask application
        app.run(
            debug=True,
            host='0.0.0.0',
            port=5000,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""
Local Development Server
"""
import os
from app import app, db, User
from werkzeug.security import generate_password_hash

def create_demo_user():
    """Create demo user for testing"""
    try:
        demo_user = User.query.filter_by(email='demo@munisat.com').first()
        if not demo_user:
            demo_user = User(
                email='demo@munisat.com',
                password_hash=generate_password_hash('demo123'),
                first_name='Demo',
                last_name='User',
                organization='Municipal Government',
                role='analyst'
            )
            db.session.add(demo_user)
            db.session.commit()
            print("Demo user created: demo@munisat.com / demo123")
    except Exception as e:
        print(f"Error creating demo user: {e}")

if __name__ == '__main__':
    print("=" * 50)
    print("MuniSat Analytics - Local Development")
    print("=" * 50)
    
    # Create database tables
    with app.app_context():
        db.create_all()
        create_demo_user()
        print("Database initialized successfully")
    
    print("\nStarting development server...")
    print("Access at: http://localhost:5000")
    print("\nDemo Login:")
    print("Email: demo@munisat.com")
    print("Password: demo123")
    print("=" * 50)
    
    # Run the application
    app.run(debug=True, host='0.0.0.0', port=5000)
