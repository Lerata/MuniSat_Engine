
import json
import sys
import os
from urllib.parse import unquote

# Add the parent directory to path to import our Flask app
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app import app

def handler(event, context):
    """Netlify function handler for Flask app"""
    
    # Convert Netlify function event to WSGI environ
    environ = {
        'REQUEST_METHOD': event.get('httpMethod', 'GET'),
        'SCRIPT_NAME': '',
        'PATH_INFO': unquote(event.get('path', '/')),
        'QUERY_STRING': event.get('queryStringParameters', ''),
        'CONTENT_TYPE': event.get('headers', {}).get('content-type', ''),
        'CONTENT_LENGTH': str(len(event.get('body', '') or '')),
        'SERVER_NAME': event.get('headers', {}).get('host', 'localhost'),
        'SERVER_PORT': '443',
        'wsgi.version': (1, 0),
        'wsgi.url_scheme': 'https',
        'wsgi.input': event.get('body', ''),
        'wsgi.errors': sys.stderr,
        'wsgi.multithread': False,
        'wsgi.multiprocess': True,
        'wsgi.run_once': False,
    }
    
    # Add headers to environ
    for key, value in event.get('headers', {}).items():
        key = key.upper().replace('-', '_')
        if key not in ('CONTENT_TYPE', 'CONTENT_LENGTH'):
            environ[f'HTTP_{key}'] = value
    
    # Capture the response
    response_data = []
    status_code = None
    headers = []
    
    def start_response(status, response_headers, exc_info=None):
        nonlocal status_code, headers
        status_code = int(status.split(' ')[0])
        headers = response_headers
        return None
    
    # Call the Flask app
    result = app(environ, start_response)
    
    # Build response body
    body = b''.join(result).decode('utf-8')
    
    # Format headers for Netlify
    netlify_headers = {}
    for header_name, header_value in headers:
        netlify_headers[header_name] = header_value
    
    return {
        'statusCode': status_code or 200,
        'headers': netlify_headers,
        'body': body
    }
