
import json
import os
import sys
from datetime import datetime

# Add the current directory to sys.path so we can import from backend
sys.path.append(os.getcwd())

try:
    from backend.database import SessionLocal, HousingNotice, init_db
except ImportError:
    # If the script is run from inside backend or somewhere else, try adjusting path
    sys.path.append(os.path.join(os.getcwd(), 'backend'))
    from backend.database import SessionLocal, HousingNotice, init_db

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, (datetime, datetime.date)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

def export_data():
    db = SessionLocal()
    try:
        notices = db.query(HousingNotice).all()
        data = []
        for notice in notices:
            # Convert SQLAlchemy object to dictionary
            notice_dict = {c.name: getattr(notice, c.name) for c in notice.__table__.columns}
            data.append(notice_dict)
        
        output_dir = 'frontend/public/data'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        output_path = os.path.join(output_dir, 'notices.json')
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, default=json_serial, ensure_ascii=False, indent=2)
            
        print(f"Successfully exported {len(data)} notices to {output_path}")
        
    finally:
        db.close()

if __name__ == "__main__":
    export_data()
