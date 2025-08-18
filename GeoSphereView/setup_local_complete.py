
#!/usr/bin/env python3
"""
Complete Local Development Setup Script
Environmental Monitoring Web Application
"""

import os
import sys
import subprocess
import platform

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python version: {version.major}.{version.minor}.{version.micro}")
    return True

def install_dependencies():
    """Install required Python packages"""
    print("📦 Installing dependencies...")
    
    # Updated dependencies with better compatibility
    dependencies = [
        "Flask==3.0.0",
        "Flask-SQLAlchemy==3.1.1",
        "Flask-Migrate==4.0.5",
        "Flask-Login==0.6.3",
        "Werkzeug==3.0.1",
        "python-dotenv==1.0.0",
        "Pillow>=10.1.0",  # More compatible version
        "numpy>=1.24.0",
        "scikit-learn>=1.3.0",
        "pandas>=2.0.0",
        "gunicorn==21.2.0"
    ]
    
    # Upgrade pip first
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '--upgrade', 'pip'])
        print("✅ Pip upgraded")
    except subprocess.CalledProcessError:
        print("⚠️  Could not upgrade pip")
    
    for package in dependencies:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
            print(f"✅ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")
            # Try without version constraint for problematic packages
            package_name = package.split('==')[0].split('>=')[0]
            try:
                print(f"Trying to install {package_name} without version constraint...")
                subprocess.check_call([sys.executable, '-m', 'pip', 'install', package_name])
                print(f"✅ Installed {package_name}")
            except subprocess.CalledProcessError:
                print(f"❌ Failed to install {package_name}")
                continue
    
    return True

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
    
    print("📁 Creating directories...")
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created: {directory}")

def create_env_file():
    """Create .env file with proper configuration"""
    env_content = """# Database Configuration
DATABASE_URL=sqlite:///instance/munisat.db

# Security (CHANGE IN PRODUCTION)
SECRET_KEY=local-development-secret-key-change-in-production

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
"""
    
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Created .env file")
    else:
        print("⚠️  .env file already exists")

def initialize_database():
    """Initialize the database"""
    print("🗄️  Initializing database...")
    try:
        from app import app, db, User
        from werkzeug.security import generate_password_hash
        
        with app.app_context():
            # Create tables
            db.create_all()
            print("✅ Database tables created")
            
            # Create demo user if no users exist
            if User.query.count() == 0:
                demo_user = User(
                    email='demo@munisat.com',
                    first_name='Demo',
                    last_name='User',
                    organization='Municipal Government',
                    role='analyst'
                )
                demo_user.set_password('demo123')
                db.session.add(demo_user)
                db.session.commit()
                print("✅ Demo user created: demo@munisat.com / demo123")
            else:
                print("✅ Database already has users")
                
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False
    
    return True

def create_run_script():
    """Create run script for easy startup"""
    run_script_content = '''#!/usr/bin/env python3
"""
Start the Environmental Monitoring Web Application
"""

import os
import sys
from app import app, db

def main():
    print("="*60)
    print("Environmental Monitoring Web Application")
    print("Starting Local Development Server")
    print("="*60)
    
    # Ensure database is initialized
    with app.app_context():
        db.create_all()
    
    print("\\n🌐 Server starting...")
    print("📍 URL: http://localhost:5000")
    print("📧 Demo Login: demo@munisat.com")
    print("🔑 Demo Password: demo123")
    print("\\n⏹️  Press Ctrl+C to stop the server")
    print("-"*60)
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\\n\\n👋 Server stopped by user")
    except Exception as e:
        print(f"\\n❌ Error: {e}")

if __name__ == '__main__':
    main()
'''
    
    with open('start_app.py', 'w') as f:
        f.write(run_script_content)
    
    # Make executable on Unix systems
    if platform.system() != 'Windows':
        os.chmod('start_app.py', 0o755)
    
    print("✅ Created start_app.py")

def main():
    """Main setup function"""
    print("="*60)
    print("Environmental Monitoring Web Application")
    print("Local Development Setup")
    print("="*60)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Create environment file
    create_env_file()
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Setup failed during dependency installation")
        print("ℹ️  You can try installing packages manually:")
        print("pip install Flask Flask-SQLAlchemy Flask-Login Werkzeug Pillow")
    
    # Initialize database
    try:
        if not initialize_database():
            print("❌ Setup failed during database initialization")
    except ImportError as e:
        print(f"⚠️  Database initialization skipped due to missing dependencies: {e}")
        print("Run the script again after installing all dependencies")
    
    # Create run script
    create_run_script()
    
    print("\n" + "="*60)
    print("🎉 Setup completed!")
    print("="*60)
    print("\n📋 Next Steps:")
    print("1. Start the application:")
    print("   python start_app.py")
    print("   OR")
    print("   python run_local.py")
    print("\n2. Open your browser to:")
    print("   http://localhost:5000")
    print("\n3. Login with demo credentials:")
    print("   Email: demo@munisat.com")
    print("   Password: demo123")
    print("\n" + "="*60)

if __name__ == '__main__':
    main()
