
#!/usr/bin/env python3
"""
Local Development Setup Script
"""
import os
import subprocess
import sys

def create_directories():
    """Create necessary directories"""
    directories = [
        'uploads', 'models', 'instance', 'logs',
        'static/css', 'static/js', 'static/images'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✓ Created directory: {directory}")

def install_dependencies():
    """Install Python dependencies"""
    try:
        print("Installing dependencies...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✓ Dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("✗ Failed to install dependencies")
        return False
    return True

def create_env_file():
    """Create .env file if it doesn't exist"""
    if not os.path.exists('.env'):
        env_content = """DATABASE_URL=sqlite:///instance/munisat.db
SECRET_KEY=local-development-secret-key
FLASK_ENV=development
FLASK_DEBUG=True
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
"""
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✓ Created .env file")

def main():
    print("=" * 50)
    print("MuniSat Analytics - Local Setup")
    print("=" * 50)
    
    create_directories()
    create_env_file()
    
    if install_dependencies():
        print("\n" + "=" * 50)
        print("Setup completed successfully!")
        print("=" * 50)
        print("\nTo start the application:")
        print("python run_local.py")
        print("\nDemo Login Credentials:")
        print("Email: demo@munisat.com")
        print("Password: demo123")
        print("\nAccess at: http://localhost:5000")
    else:
        print("Setup failed. Please install dependencies manually.")

if __name__ == '__main__':
    main()
