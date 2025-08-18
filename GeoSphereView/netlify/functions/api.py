
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app import app

def handler(event, context):
    """Netlify function handler"""
    return app(event, context)
