
#!/usr/bin/env python3
"""
Simple startup script for the Environmental Monitoring Web Application
"""

import os
import sys

def main():
    print("="*60)
    print("Environmental Monitoring Web Application")
    print("Starting Local Development Server...")
    print("="*60)
    
    # Check if we're in the right directory
    if not os.path.exists('app.py'):
        print("Error: app.py not found in current directory")
        print("Please run this script from the GeoSphereView directory")
        sys.exit(1)
    
    # Import and start the application
    try:
        from run_local import main as run_local_main
        run_local_main()
    except ImportError as e:
        print(f"Import error: {e}")
        print("Falling back to direct app execution...")
        try:
            from app import app, db, User
            from werkzeug.security import generate_password_hash
            
            # Initialize database
            with app.app_context():
                db.create_all()
                
                # Create demo user
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
            
            print("Access at: http://localhost:5000")
            print("Demo login: demo@munisat.com / demo123")
            app.run(debug=True, host='0.0.0.0', port=5000)
            
        except Exception as e:
            print(f"Failed to start application: {e}")
            sys.exit(1)

if __name__ == '__main__':
    main()
