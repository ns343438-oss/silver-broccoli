from backend.database import SessionLocal, HousingNotice, init_db
from backend.scraper import run_scraping_job
from sqlalchemy import text

def reset_and_scrape():
    print("Resetting Database...")
    init_db()
    db = SessionLocal()
    
    # Delete all notices
    try:
        db.query(HousingNotice).delete()
        db.commit()
        print("Scrubbed all mock data.")
    except Exception as e:
        print(f"Error clearing data: {e}")
        db.rollback()
    finally:
        db.close()

    print("Starting Real Scraping Job...")
    run_scraping_job()
    print("Done!")

if __name__ == "__main__":
    reset_and_scrape()
