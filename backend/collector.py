from database import SessionLocal, HousingNotice, Base, engine
from geocoder import get_coordinates
from scrapers.sh_scraper import SHScraper
from scrapers.lh_scraper import LHScraper
from scrapers.myhome_scraper import MyHomeScraper
from datetime import datetime
# MyHome to be added later

def run_collection_job():
    print("Job Started: Data Collection (All Sources)")
    
    # Ensure DB tables exist
    Base.metadata.create_all(bind=engine)
    
    scrapers = [
        SHScraper(),
        LHScraper(),
        MyHomeScraper()
    ]
    
    all_data = []
    
    # 1. Collect
    for scraper in scrapers:
        try:
            data = scraper.scrape()
            all_data.extend(data)
        except Exception as e:
            print(f"Scraper Error: {e}")
            
    # 2. Save / Deduplicate
    db = SessionLocal()
    saved_count = 0
    
    for item in all_data:
        # Deduplication Key: Title + Region (Simple)
        # In real world, might need fuzzy match.
        exists = db.query(HousingNotice).filter(
            HousingNotice.title == item['title']
        ).first()
        
        if not exists:
            # Geocoding if needed
            lat, lng = 0.0, 0.0
            if item.get('address'):
                lat, lng = get_coordinates(item['address'])
            
            # Parse notice_date if it's a string
            notice_date_val = item['date']
            if isinstance(notice_date_val, str):
                try:
                    notice_date_val = datetime.strptime(notice_date_val, "%Y-%m-%d")
                except ValueError:
                    notice_date_val = datetime.utcnow() # Fallback
            
            notice = HousingNotice(
                title=item['title'],
                platform=item['platform'],
                notice_date=notice_date_val, 
                link=item['link'],
                start_date=item['start_date'],
                end_date=item['end_date'],
                region=item['region'],
                address=item['address'],
                deposit=item['deposit'], 
                rent=item['rent'], 
                area=item['area'],
                lat=lat,
                lng=lng,
                summary_qualifications=item['qualifications'],
                summary_income=item['income'],
                summary_assets=item['assets']
            )
            db.add(notice)
            saved_count += 1
            print(f"Saved [{item['platform']}]: {item['title']}")
        else:
            # Update updated_at?
            pass
            
    db.commit()
    db.close()
    print(f"Job Finished. Saved {saved_count} new notices.")

if __name__ == "__main__":
    run_collection_job()
