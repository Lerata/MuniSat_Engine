#!/usr/bin/env python3
"""
Database migration script to add new columns to AnalysisResult table
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db

def migrate_database():
    """Apply database migrations for new AnalysisResult columns"""
    with app.app_context():
        try:
            # Check if we're using SQLite or PostgreSQL
            database_url = app.config['SQLALCHEMY_DATABASE_URI']
            is_sqlite = database_url.startswith('sqlite')
            
            if is_sqlite:
                print("Detected SQLite database - dropping and recreating all tables")
                db.drop_all()
                db.create_all()
                print("SQLite database recreated with new schema")
            else:
                print("Detected PostgreSQL - applying column migrations")
                
                # Add new columns to analysis_results table if they don't exist
                migrations = [
                    "ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS detection_date TIMESTAMP;",
                    "ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS latitude FLOAT;", 
                    "ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS longitude FLOAT;",
                    "ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS alert_sent BOOLEAN DEFAULT FALSE;",
                    "ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS reviewed BOOLEAN DEFAULT FALSE;",
                    "ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS reviewer_notes TEXT;",
                    "ALTER TABLE analysis_results ALTER COLUMN image_id DROP NOT NULL;"
                ]
                
                with db.engine.connect() as connection:
                    for migration in migrations:
                        try:
                            result = connection.execute(db.text(migration))
                            print(f"Applied: {migration}")
                        except Exception as e:
                            print(f"Migration already applied or failed: {migration} - {e}")
                    
                    connection.commit()
                print("PostgreSQL migrations completed")
            
            return True
            
        except Exception as e:
            print(f"Migration failed: {e}")
            db.session.rollback()
            return False

if __name__ == '__main__':
    success = migrate_database()
    sys.exit(0 if success else 1)