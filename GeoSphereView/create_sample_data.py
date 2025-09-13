#!/usr/bin/env python3
"""
Create sample detection data for MVP demonstration
"""

import os
import sys
from datetime import datetime, timedelta
import random

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db, AnalysisResult

def create_sample_detections():
    """Create sample detection data for demonstration"""
    
    # Johannesburg area coordinates
    base_coords = [
        (-26.2041, 28.0473),  # Johannesburg CBD
        (-26.1520, 28.0353),  # Randburg
        (-26.1367, 28.0851),  # Sandton
        (-26.3015, 28.1367),  # Alberton
        (-26.1849, 27.9760),  # Roodepoort
        (-26.1228, 28.1121),  # Midrand
        (-26.2618, 28.1041),  # South of JHB
        (-26.1641, 28.1300),  # Bedfordview
        (-26.2285, 27.9715),  # West of JHB
        (-26.1436, 28.0426),  # North of JHB
    ]
    
    detection_types = ['informal_settlement', 'illegal_dumping']
    priorities = ['high', 'medium', 'low']
    
    sample_detections = []
    
    for i in range(25):  # Create 25 sample detections
        base_lat, base_lon = random.choice(base_coords)
        
        # Add random offset (within ~1km)
        lat_offset = random.uniform(-0.005, 0.005)
        lon_offset = random.uniform(-0.005, 0.005)
        
        # Create detection
        detection = AnalysisResult(
            detection_type=random.choice(detection_types),
            confidence_score=round(random.uniform(0.65, 0.95), 2),
            latitude=base_lat + lat_offset,
            longitude=base_lon + lon_offset,
            area=round(random.uniform(0.1, 2.5), 2),
            priority=random.choice(priorities),
            status=random.choice(['detected', 'investigating', 'resolved']),
            detection_date=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
            alert_sent=random.choice([True, False]),
            reviewed=random.choice([True, False]),
            analysis_metadata={
                'detection_method': 'YOLO_v8',
                'satellite_source': 'Sentinel-2',
                'weather_conditions': random.choice(['clear', 'cloudy', 'partly_cloudy']),
                'image_quality': random.choice(['high', 'medium', 'good'])
            }
        )
        
        sample_detections.append(detection)
    
    return sample_detections

def main():
    """Main function to create sample data"""
    with app.app_context():
        print("Creating sample detection data...")
        
        # Check if data already exists
        existing_count = AnalysisResult.query.count()
        if existing_count > 0:
            print(f"Found {existing_count} existing detections. Adding more samples...")
        
        # Create new sample data
        detections = create_sample_detections()
        
        for detection in detections:
            db.session.add(detection)
        
        try:
            db.session.commit()
            print(f"Successfully created {len(detections)} sample detections!")
            
            # Print summary
            total = AnalysisResult.query.count()
            high_priority = AnalysisResult.query.filter_by(priority='high').count()
            informal = AnalysisResult.query.filter_by(detection_type='informal_settlement').count()
            dumping = AnalysisResult.query.filter_by(detection_type='illegal_dumping').count()
            
            print(f"\nDatabase Summary:")
            print(f"Total detections: {total}")
            print(f"High priority: {high_priority}")
            print(f"Informal settlements: {informal}")
            print(f"Illegal dumping: {dumping}")
            
        except Exception as e:
            db.session.rollback()
            print(f"Error creating sample data: {e}")
            return False
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)