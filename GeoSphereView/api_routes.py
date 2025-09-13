#!/usr/bin/env python3
"""
API Routes for MuniSat Analytics MVP
Handles all API endpoints for the dashboard functionality
"""

from flask import request, jsonify, send_file
from flask_login import login_required, current_user
from datetime import datetime, timedelta
import json
import os
import uuid
from io import BytesIO
from werkzeug.utils import secure_filename

try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    REPORTLAB_AVAILABLE = True
except ImportError:
    print("ReportLab not available - PDF generation will be limited")
    REPORTLAB_AVAILABLE = False

from app import app, db, AnalysisResult, Report, UploadedImage
from ml_detection import detector

@app.route('/api/detections', methods=['GET'])
@login_required
def api_get_detections():
    """Get all detections with filtering options"""
    try:
        # Get query parameters
        detection_type = request.args.get('type')
        priority = request.args.get('priority')
        limit = int(request.args.get('limit', 100))
        
        # Build query
        query = AnalysisResult.query
        
        if detection_type:
            query = query.filter_by(detection_type=detection_type)
        if priority:
            query = query.filter_by(priority=priority)
            
        detections = query.order_by(AnalysisResult.created_at.desc()).limit(limit).all()
        
        # Convert to dict format
        detection_data = []
        for det in detections:
            detection_data.append({
                'id': det.id,
                'detection_type': det.detection_type,
                'confidence_score': det.confidence_score,
                'latitude': det.latitude,
                'longitude': det.longitude,
                'area': det.area,
                'priority': det.priority,
                'status': det.status,
                'detection_date': det.detection_date.isoformat() if det.detection_date else None,
                'created_at': det.created_at.isoformat() if det.created_at else None,
                'alert_sent': det.alert_sent,
                'reviewed': det.reviewed
            })
        
        # Calculate statistics
        total = AnalysisResult.query.count()
        high_priority = AnalysisResult.query.filter_by(priority='high').count()
        recent = AnalysisResult.query.filter(
            AnalysisResult.created_at >= datetime.utcnow() - timedelta(days=7)
        ).count()
        
        # Get recent alerts
        recent_alerts = AnalysisResult.query.filter_by(priority='high').order_by(
            AnalysisResult.created_at.desc()
        ).limit(5).all()
        
        alert_data = [{
            'detection_type': alert.detection_type,
            'priority': alert.priority,
            'created_at': alert.created_at.isoformat() if alert.created_at else None,
            'latitude': alert.latitude,
            'longitude': alert.longitude
        } for alert in recent_alerts]
        
        return jsonify({
            'success': True,
            'detections': detection_data,
            'stats': {
                'total': total,
                'high_priority': high_priority,
                'recent': recent
            },
            'recent_alerts': alert_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analyze-area', methods=['POST'])
@login_required
def api_analyze_area():
    """Analyze a specific area for informal settlements"""
    try:
        data = request.get_json()
        latitude = float(data.get('latitude'))
        longitude = float(data.get('longitude'))
        
        if not latitude or not longitude:
            return jsonify({
                'success': False,
                'error': 'Latitude and longitude are required'
            }), 400
        
        # Run detection
        detection_result = detector.detect_from_coordinates(latitude, longitude)
        
        if detection_result['success']:
            # Save detections to database
            saved_detections = []
            for det in detection_result['detections']:
                analysis_result = AnalysisResult(
                    detection_type='informal_settlement',
                    confidence_score=det['confidence'],
                    latitude=det['coordinates']['lat'],
                    longitude=det['coordinates']['lon'],
                    area=det.get('area_hectares'),
                    priority=det.get('priority', 'medium'),
                    status='detected',
                    detection_date=datetime.utcnow(),
                    analysis_metadata=det
                )
                db.session.add(analysis_result)
                saved_detections.append(det)
            
            db.session.commit()
            
            return jsonify({
                'success': True,
                'detections': saved_detections,
                'message': f'Analysis complete. Found {len(saved_detections)} detection(s)'
            })
        else:
            return jsonify({
                'success': False,
                'error': detection_result.get('error', 'Analysis failed')
            }), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/detections/<detection_id>', methods=['PUT'])
@login_required
def api_update_detection(detection_id):
    """Update a detection's status or priority"""
    try:
        data = request.get_json()
        
        detection = AnalysisResult.query.get(detection_id)
        if not detection:
            return jsonify({
                'success': False,
                'error': 'Detection not found'
            }), 404
        
        # Update fields
        if 'status' in data:
            detection.status = data['status']
        if 'priority' in data:
            detection.priority = data['priority']
        if 'reviewer_notes' in data:
            detection.reviewer_notes = data['reviewer_notes']
            detection.reviewed = True
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Detection updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/send-alert', methods=['POST'])
@login_required
def api_send_alert():
    """Send alert for a specific detection"""
    try:
        data = request.get_json()
        detection_id = data.get('detection_id')
        
        detection = AnalysisResult.query.get(detection_id)
        if not detection:
            return jsonify({
                'success': False,
                'error': 'Detection not found'
            }), 404
        
        # In a real implementation, you would send SMS via Twilio or similar service
        # For now, we'll simulate this
        
        # Mark alert as sent
        detection.alert_sent = True
        db.session.commit()
        
        # Simulate SMS sending (replace with actual SMS service)
        alert_message = f"""
        MUNISAT ALERT: {detection.detection_type.replace('_', ' ').title()} detected
        Location: {detection.latitude}, {detection.longitude}
        Priority: {detection.priority.upper()}
        Confidence: {detection.confidence_score}%
        Date: {detection.detection_date.strftime('%Y-%m-%d %H:%M')}
        """
        
        print(f"[SIMULATED SMS ALERT] {alert_message}")
        
        return jsonify({
            'success': True,
            'message': 'Alert sent successfully',
            'alert_details': {
                'detection_type': detection.detection_type,
                'priority': detection.priority,
                'coordinates': [detection.latitude, detection.longitude]
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/generate-report', methods=['POST'])
@login_required
def api_generate_report():
    """Generate PDF report for current detections"""
    try:
        data = request.get_json() or {}
        report_type = data.get('type', 'area_analysis')
        filters = data.get('filters', {})
        
        # Get detections based on filters
        query = AnalysisResult.query
        
        if filters.get('include_informal_settlements') == False:
            query = query.filter(AnalysisResult.detection_type != 'informal_settlement')
        if filters.get('include_illegal_dumping') == False:
            query = query.filter(AnalysisResult.detection_type != 'illegal_dumping')
            
        detections = query.order_by(AnalysisResult.created_at.desc()).all()
        
        # Generate PDF report
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title = Paragraph("MuniSat Analytics Detection Report", styles['Title'])
        story.append(title)
        story.append(Spacer(1, 20))
        
        # Summary
        summary_text = f"""
        Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        Total Detections: {len(detections)}
        High Priority: {len([d for d in detections if d.priority == 'high'])}
        Medium Priority: {len([d for d in detections if d.priority == 'medium'])}
        Low Priority: {len([d for d in detections if d.priority == 'low'])}
        """
        
        summary = Paragraph(summary_text, styles['Normal'])
        story.append(summary)
        story.append(Spacer(1, 20))
        
        # Detections table
        if detections:
            table_data = [['Type', 'Confidence', 'Priority', 'Location', 'Date']]
            
            for det in detections[:50]:  # Limit to first 50 for PDF size
                table_data.append([
                    det.detection_type.replace('_', ' ').title(),
                    f"{det.confidence_score}%",
                    det.priority.title(),
                    f"{det.latitude:.4f}, {det.longitude:.4f}",
                    det.detection_date.strftime('%Y-%m-%d') if det.detection_date else 'N/A'
                ])
            
            table = Table(table_data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            story.append(table)
        
        doc.build(story)
        buffer.seek(0)
        
        # Save report record
        report = Report(
            user_id=current_user.id,
            title=f"Detection Report - {datetime.now().strftime('%Y-%m-%d')}",
            report_type=report_type,
            parameters=data,
            status='generated'
        )
        db.session.add(report)
        db.session.commit()
        
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f'munisat_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf',
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Upload and analyze image endpoint
@app.route('/api/upload-analyze', methods=['POST'])
@login_required
def api_upload_analyze():
    """Upload and analyze an image for detections"""
    try:
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        if file:
            # Save uploaded file
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(filepath)
            
            # Save to database
            uploaded_image = UploadedImage(
                user_id=current_user.id,
                filename=unique_filename,
                original_filename=filename,
                file_path=filepath,
                analysis_type='informal_settlement_detection'
            )
            db.session.add(uploaded_image)
            db.session.flush()
            
            # Run detection
            detection_result = detector.detect_from_image(filepath)
            
            if detection_result['success']:
                # Save detections
                for det in detection_result['detections']:
                    analysis_result = AnalysisResult(
                        image_id=uploaded_image.id,
                        detection_type='informal_settlement',
                        confidence_score=det['confidence'],
                        coordinates={'bbox': det['bbox']},
                        area=det.get('area_pixels'),
                        priority=det.get('priority', 'medium'),
                        status='detected',
                        detection_date=datetime.utcnow(),
                        analysis_metadata=det
                    )
                    db.session.add(analysis_result)
                
                db.session.commit()
                
                return jsonify({
                    'success': True,
                    'detections': detection_result['detections'],
                    'image_id': uploaded_image.id,
                    'message': f'Image analyzed successfully. Found {len(detection_result["detections"])} detection(s)'
                })
            else:
                db.session.rollback()
                return jsonify({
                    'success': False,
                    'error': detection_result.get('error', 'Analysis failed')
                }), 500
                
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500