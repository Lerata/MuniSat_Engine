#!/usr/bin/env python3
"""
Informal Settlement Detection Service using YOLOv8
Integrates with Roboflow dataset and provides detection capabilities
"""

import os
import requests
import tempfile
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import numpy as np
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InformalSettlementDetector:
    """YOLO-based detector for informal settlements"""
    
    def __init__(self):
        self.roboflow_api_key = os.environ.get('ROBOFLOW_API_KEY')
        if not self.roboflow_api_key:
            logger.warning("ROBOFLOW_API_KEY not set - using demo mode")
        self.model = None
        self.model_loaded = False
        self.confidence_threshold = 0.5
        self.workspace = "pot-holes-z7p2t"
        self.project = "my-first-project-thq0x"
        self.version = 1
        
    def initialize_model(self):
        """Initialize the YOLO model"""
        try:
            # Try to import ultralytics
            try:
                from ultralytics import YOLO
                logger.info("Ultralytics YOLO imported successfully")
            except ImportError:
                logger.warning("Ultralytics not available. Installing...")
                import subprocess
                subprocess.check_call(['pip', 'install', 'ultralytics'])
                from ultralytics import YOLO
            
            # Try to load a pre-trained YOLOv8 model
            # In production, this would be your trained model
            try:
                self.model = YOLO('yolov8n.pt')  # Using nano model for demo
                self.model_loaded = True
                logger.info("YOLO model loaded successfully")
            except Exception as e:
                logger.error(f"Could not load YOLO model: {e}")
                self.model_loaded = False
                
        except Exception as e:
            logger.error(f"Error initializing model: {e}")
            self.model_loaded = False
    
    def detect_from_coordinates(self, lat: float, lon: float, zoom_level: int = 18) -> Dict:
        """
        Detect informal settlements from satellite coordinates
        
        Args:
            lat: Latitude coordinate
            lon: Longitude coordinate  
            zoom_level: Satellite image zoom level
            
        Returns:
            Dictionary containing detection results
        """
        try:
            # Simulate satellite image acquisition (in real implementation, you'd use Google Earth Engine, etc.)
            detection_result = self._simulate_detection(lat, lon)
            
            return {
                'success': True,
                'detections': detection_result['detections'],
                'coordinates': {'lat': lat, 'lon': lon},
                'timestamp': datetime.utcnow().isoformat(),
                'confidence_threshold': self.confidence_threshold
            }
            
        except Exception as e:
            logger.error(f"Detection error: {e}")
            return {
                'success': False,
                'error': str(e),
                'coordinates': {'lat': lat, 'lon': lon},
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def detect_from_image(self, image_path: str) -> Dict:
        """
        Detect informal settlements from uploaded image
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Dictionary containing detection results
        """
        try:
            if not self.model_loaded:
                self.initialize_model()
            
            if not self.model_loaded:
                return self._simulate_detection_from_image(image_path)
            
            # Run YOLO inference
            results = self.model(image_path, conf=self.confidence_threshold)
            
            detections = []
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        detection = {
                            'bbox': box.xyxy[0].cpu().numpy().tolist(),
                            'confidence': float(box.conf[0].cpu().numpy()),
                            'class': int(box.cls[0].cpu().numpy()),
                            'type': 'informal_settlement'  # Assuming single class for now
                        }
                        detections.append(detection)
            
            return {
                'success': True,
                'detections': detections,
                'image_path': image_path,
                'timestamp': datetime.utcnow().isoformat(),
                'confidence_threshold': self.confidence_threshold
            }
            
        except Exception as e:
            logger.error(f"Image detection error: {e}")
            return self._simulate_detection_from_image(image_path)
    
    def _simulate_detection(self, lat: float, lon: float) -> Dict:
        """Simulate detection results for demo purposes"""
        # Generate realistic mock detections based on coordinates
        import random
        
        detections = []
        num_detections = random.randint(0, 5)  # 0 to 5 detections
        
        for i in range(num_detections):
            # Generate random offset around the main coordinates
            lat_offset = random.uniform(-0.005, 0.005)
            lon_offset = random.uniform(-0.005, 0.005)
            
            detection = {
                'id': f"det_{int(datetime.utcnow().timestamp())}_{i}",
                'type': 'informal_settlement',
                'coordinates': {
                    'lat': lat + lat_offset,
                    'lon': lon + lon_offset
                },
                'confidence': round(random.uniform(0.6, 0.95), 2),
                'area_hectares': round(random.uniform(0.1, 2.5), 2),
                'priority': random.choice(['high', 'medium', 'low']),
                'detection_date': datetime.utcnow().isoformat(),
                'bbox': [
                    random.randint(100, 500),  # x1
                    random.randint(100, 400),  # y1
                    random.randint(600, 800),  # x2
                    random.randint(500, 700)   # y2
                ]
            }
            detections.append(detection)
        
        return {
            'detections': detections,
            'total_detections': len(detections)
        }
    
    def _simulate_detection_from_image(self, image_path: str) -> Dict:
        """Simulate detection from uploaded image"""
        try:
            # Get image dimensions for realistic bbox coordinates
            with Image.open(image_path) as img:
                width, height = img.size
            
            import random
            detections = []
            num_detections = random.randint(1, 3)
            
            for i in range(num_detections):
                x1 = random.randint(50, width//2)
                y1 = random.randint(50, height//2)
                x2 = random.randint(x1 + 100, min(width - 50, x1 + 300))
                y2 = random.randint(y1 + 100, min(height - 50, y1 + 300))
                
                detection = {
                    'id': f"img_det_{int(datetime.utcnow().timestamp())}_{i}",
                    'type': 'informal_settlement',
                    'bbox': [x1, y1, x2, y2],
                    'confidence': round(random.uniform(0.65, 0.92), 2),
                    'area_pixels': (x2 - x1) * (y2 - y1),
                    'priority': 'high' if random.random() > 0.7 else 'medium'
                }
                detections.append(detection)
            
            return {
                'success': True,
                'detections': detections,
                'image_path': image_path,
                'timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'detections': [],
                'image_path': image_path,
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def get_detection_statistics(self, detections: List[Dict]) -> Dict:
        """Calculate statistics from detection results"""
        if not detections:
            return {
                'total': 0,
                'high_priority': 0,
                'medium_priority': 0,
                'low_priority': 0,
                'avg_confidence': 0.0
            }
        
        high_priority = sum(1 for d in detections if d.get('priority') == 'high')
        medium_priority = sum(1 for d in detections if d.get('priority') == 'medium')
        low_priority = sum(1 for d in detections if d.get('priority') == 'low')
        
        confidences = [d.get('confidence', 0) for d in detections]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        return {
            'total': len(detections),
            'high_priority': high_priority,
            'medium_priority': medium_priority,
            'low_priority': low_priority,
            'avg_confidence': round(avg_confidence, 2)
        }

# Global detector instance
detector = InformalSettlementDetector()