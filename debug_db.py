import sys
import os
sys.path.append(os.path.abspath("backend"))
# Adjust path specifically to import from 'backend' package context if needed
# But since we run from root, 'backend.database' is fine if root is in path.

try:
    from backend.database import init_db, SessionLocal
    from backend.main import app
    print("Imports successful")
    
    init_db()
    print("init_db successful")
    
    db = SessionLocal()
    print("Session created")
    db.close()
    
except Exception as e:
    import traceback
    traceback.print_exc()
