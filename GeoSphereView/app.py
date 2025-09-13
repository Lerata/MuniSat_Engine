#!/usr/bin/env python3
"""
Municipal Satellite Analysis Web Application
A comprehensive platform for environmental monitoring using satellite imagery
"""

import os
import secrets
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import json
import uuid

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(16))

# Database configuration - PostgreSQL for production, SQLite for development
database_url = os.environ.get('DATABASE_URL')
if database_url and database_url.startswith('postgres://'):
    # Fix for Render's PostgreSQL URL format
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///instance/munisat.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB

# Production settings
if os.environ.get('FLASK_ENV') == 'production':
    app.config['DEBUG'] = False
    app.config['TESTING'] = False
else:
    app.config['DEBUG'] = True

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('instance', exist_ok=True)

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'

# Database Models
class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    organization = db.Column(db.String(255))
    role = db.Column(db.String(50), default='analyst')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    uploaded_images = db.relationship('UploadedImage', backref='user', lazy=True)
    reports = db.relationship('Report', backref='user', lazy=True)

class UploadedImage(db.Model):
    __tablename__ = 'uploaded_images'

    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    analysis_type = db.Column(db.String(100))
    upload_timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    analysis_results = db.Column(db.JSON)

    # Relationships
    analysis_results_rel = db.relationship('AnalysisResult', backref='image', lazy=True)

class AnalysisResult(db.Model):
    __tablename__ = 'analysis_results'

    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    image_id = db.Column(db.String(50), db.ForeignKey('uploaded_images.id'), nullable=True)
    detection_type = db.Column(db.String(100), nullable=False)
    confidence_score = db.Column(db.Float)
    coordinates = db.Column(db.JSON)  # Store lat/lon or bbox coordinates
    area = db.Column(db.Float)  # Area in hectares or pixels
    status = db.Column(db.String(50), default='detected')
    priority = db.Column(db.String(20), default='medium')
    analysis_metadata = db.Column(db.JSON)
    detection_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # New fields for MVP features
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    alert_sent = db.Column(db.Boolean, default=False)
    reviewed = db.Column(db.Boolean, default=False)
    reviewer_notes = db.Column(db.Text)

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    report_type = db.Column(db.String(100), nullable=False)
    parameters = db.Column(db.JSON)
    status = db.Column(db.String(50), default='generated')
    file_path = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

# Routes
@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if not email or not password:
            flash('Email and password are required.', 'error')
            return render_template('login.html')

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password_hash, password):
            login_user(user, remember=True)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password.', 'error')

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        organization = request.form.get('organization')

        # Validation
        if not all([email, password, confirm_password, first_name, last_name]):
            flash('All fields are required.', 'error')
            return render_template('register.html')

        if password != confirm_password:
            flash('Passwords do not match.', 'error')
            return render_template('register.html')

        if len(password) < 6:
            flash('Password must be at least 6 characters long.', 'error')
            return render_template('register.html')

        # Check if user already exists
        if User.query.filter_by(email=email).first():
            flash('Email address already registered.', 'error')
            return render_template('register.html')

        # Create new user
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            first_name=first_name,
            last_name=last_name,
            organization=organization,
            role='analyst'
        )

        try:
            db.session.add(user)
            db.session.commit()
            login_user(user)
            flash('Registration successful! Welcome to MuniSat Analytics.', 'success')
            return redirect(url_for('dashboard'))
        except Exception as e:
            db.session.rollback()
            flash('Registration failed. Please try again.', 'error')

    return render_template('register.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    # Use the new MVP dashboard
    return render_template('dashboard_mvp.html')

@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload():
    if request.method == 'POST':
        if 'images' not in request.files:
            return jsonify({'error': 'No files uploaded'}), 400

        files = request.files.getlist('images')
        analysis_type = request.form.get('analysis_type', 'comprehensive')

        uploaded_files = []

        for file in files:
            if file and file.filename:
                # Secure the filename
                original_filename = file.filename
                filename = secure_filename(f"{uuid.uuid4()}_{original_filename}")
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

                try:
                    file.save(file_path)

                    # Save to database
                    uploaded_image = UploadedImage(
                        user_id=current_user.id,
                        filename=filename,
                        original_filename=original_filename,
                        file_path=file_path,
                        analysis_type=analysis_type
                    )

                    db.session.add(uploaded_image)
                    db.session.commit()

                    # Trigger analysis (placeholder for ML integration)
                    analyze_image(uploaded_image.id)

                    uploaded_files.append({
                        'id': uploaded_image.id,
                        'filename': original_filename,
                        'analysis_type': analysis_type
                    })

                except Exception as e:
                    return jsonify({'error': f'Failed to upload {original_filename}'}), 500

        return jsonify({'uploaded_files': uploaded_files})

    return render_template('upload.html')

@app.route('/analysis')
@login_required
def analysis():
    # Get user's analysis results
    results = db.session.query(AnalysisResult).join(UploadedImage).filter(
        UploadedImage.user_id == current_user.id
    ).order_by(AnalysisResult.created_at.desc()).all()

    return render_template('analysis.html', results=results)

@app.route('/reports')
@login_required
def reports():
    user_reports = Report.query.filter_by(user_id=current_user.id).order_by(Report.created_at.desc()).all()
    return render_template('reports.html', reports=user_reports)

@app.route('/generate_report', methods=['POST'])
@login_required
def generate_report():
    report_type = request.form.get('report_type')
    date_range = request.form.get('date_range', '30')

    # Create new report
    report = Report(
        user_id=current_user.id,
        title=f"{report_type.replace('_', ' ').title()} Report",
        report_type=report_type,
        parameters={'date_range': date_range},
        status='generated'
    )

    db.session.add(report)
    db.session.commit()

    flash('Report generated successfully!', 'success')
    return redirect(url_for('reports'))

@app.route('/uploads/<filename>')
@login_required
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ML Integration Functions
def analyze_image(image_id):
    """
    ML INTEGRATION POINT - Now uses the ml_models.py module

    This function is called after an image is uploaded to perform analysis.
    Your ML models are integrated through the ml_models.py module.
    """
    try:
        from ml_models import process_image

        uploaded_image = UploadedImage.query.get(image_id)
        if not uploaded_image:
            return

        # Get analysis type from the uploaded image
        analysis_type = uploaded_image.analysis_type or 'comprehensive'

        # Process image using ML models
        ml_results = process_image(uploaded_image.file_path, analysis_type)

        # Save analysis results to database
        detection_count = 0
        for result in ml_results:
            if 'error' not in result:
                analysis_result = AnalysisResult(
                    image_id=image_id,
                    detection_type=result['detection_type'],
                    confidence_score=result['confidence_score'],
                    coordinates=result['coordinates'],
                    area=result['area'],
                    priority=result['priority'],
                    analysis_metadata=result.get('metadata', {})
                )
                db.session.add(analysis_result)
                detection_count += 1

        # Update image with analysis completion
        uploaded_image.analysis_results = {
            'status': 'completed',
            'detections': detection_count,
            'analysis_type': analysis_type,
            'timestamp': datetime.utcnow().isoformat()
        }
        db.session.commit()

        print(f"Analysis completed for image {image_id}: {detection_count} detections found")

    except Exception as e:
        print(f"Analysis failed for image {image_id}: {str(e)}")

        # Update image with error status
        try:
            uploaded_image = UploadedImage.query.get(image_id)
            if uploaded_image:
                uploaded_image.analysis_results = {
                    'status': 'failed',
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                }
                db.session.commit()
        except:
            pass

# API Routes for AJAX calls
@app.route('/api/dashboard/stats')
@login_required
def api_dashboard_stats():
    stats = {
        'total_uploads': UploadedImage.query.filter_by(user_id=current_user.id).count(),
        'total_analyses': AnalysisResult.query.join(UploadedImage).filter(UploadedImage.user_id == current_user.id).count(),
        'active_alerts': AnalysisResult.query.join(UploadedImage).filter(
            UploadedImage.user_id == current_user.id,
            AnalysisResult.priority == 'high'
        ).count(),
        'areas_monitored': 5  # Mock data
    }
    return jsonify(stats)

@app.route('/api/recent_detections')
@login_required
def api_recent_detections():
    results = db.session.query(AnalysisResult).join(UploadedImage).filter(
        UploadedImage.user_id == current_user.id
    ).order_by(AnalysisResult.created_at.desc()).limit(10).all()

    detections = []
    for result in results:
        detections.append({
            'id': result.id,
            'type': result.detection_type,
            'confidence': result.confidence_score,
            'area': result.area,
            'priority': result.priority,
            'date': result.created_at.isoformat()
        })

    return jsonify(detections)

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500.html'), 500

# Initialize database and demo data
def init_db():
    """Initialize database tables and demo data"""
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully")
            
            # Create demo user if it doesn't exist
            demo_user = User.query.filter_by(email='demo@munisat.com').first()
            if not demo_user:
                from werkzeug.security import generate_password_hash
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
            print(f"Database initialization error: {e}")

# Initialize database on import (for production servers like Gunicorn)
init_db()

# Import API routes after app initialization
try:
    import api_routes
except ImportError as e:
    print(f"Could not import API routes: {e}")
    print("API functionality may be limited")

if __name__ == '__main__':
    # Development server
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    print("Starting Environmental Monitoring Web Application...")
    print("Demo login: demo@munisat.com / demo123")
    print(f"Access at: http://0.0.0.0:{port}")
    app.run(debug=debug_mode, host='0.0.0.0', port=port)