
#!/usr/bin/env python3
"""
Local Development Server
Environmental Monitoring Web Application
"""

import os
import sys
from app import app, db, User
from werkzeug.security import generate_password_hash

def setup_environment():
    """Setup environment variables and configurations"""
    # Set default environment variables if not already set
    if not os.environ.get('DATABASE_URL'):
        # Use absolute path for Windows compatibility
        db_path = os.path.abspath('instance/munisat.db')
        os.environ['DATABASE_URL'] = f'sqlite:///{db_path}'
    
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
    """Initialize the database with tables and demo user"""
    try:
        with app.app_context():
            # Create all tables
            db.create_all()
            print("Database tables created successfully")
            
            # Check if demo user exists
            demo_user = User.query.filter_by(email='demo@munisat.com').first()
            
            if not demo_user:
                # Create demo user
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
                print("Demo user created successfully")
                print("Demo login credentials:")
                print("  Email: demo@munisat.com")
                print("  Password: demo123")
            else:
                print("Demo user already exists")
                print("Demo login credentials:")
                print("  Email: demo@munisat.com")
                print("  Password: demo123")
            
            # Verify user count
            user_count = User.query.count()
            print(f"Total users in database: {user_count}")
                
    except Exception as e:
        print(f"Database initialization error: {str(e)}")
        print("Make sure your database is properly configured")
        return False
    
    return True

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
    if not initialize_database():
        print("Database initialization failed. Exiting...")
        sys.exit(1)
    
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
