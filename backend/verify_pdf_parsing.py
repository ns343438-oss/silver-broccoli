import sys
import os
import datetime
# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from file_parser import parse_pdf, RegexParser
from database import SessionLocal, HousingNotice
from geocoder import get_coordinates

def verify_and_insert():
    pdf_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mock_notice.pdf")
    print(f"Parsing {pdf_path}...")
    
    # 1. Parse PDF Text
    text = parse_pdf(pdf_path)
    print(f"--- Extracted Text ---\n{text}\n----------------------")
    
    # 2. Apply Regex
    parser = RegexParser()
    data = parser.parse(text)
    print(f"--- Parsed Data ---\n{data}\n-------------------")
    
    # 3. Extract Best Values
    area = max(data['areas']) if data['areas'] else 25.0
    deposit = 0
    rent = 0
    
    # Heuristic: Max is deposit, min is rent if distinct?
    # Our regex returns [(string, value), ...]
    # data['amounts'] = [('50000000', 50000000.0), ('300000', 300000.0)]
    vals = [v for _, v in data['amounts']]
    if vals:
        deposit = max(vals)
        rent = min(vals) if len(vals) > 1 else 0
        
    print(f"Decided -> Area: {area}, Deposit: {deposit}, Rent: {rent}")
    
    # 4. Insert into DB
    db = SessionLocal()
    
    # Geocoding Mock
    lat, lng = get_coordinates("서울시 강남구 삼성동")
    
    notice = HousingNotice(
        title="[Verification] Mock PDF Parsed Notice",
        platform="Test",
        link="file://mock_notice.pdf",
        notice_date=datetime.datetime.utcnow(),
        start_date=datetime.datetime.utcnow(),
        end_date=datetime.datetime.utcnow(),
        region="Gangnam-gu",
        address="서울시 강남구 삼성동",
        deposit=int(deposit),
        rent=int(rent),
        area=area,
        lat=lat,
        lng=lng,
        summary_qualifications="Test User",
        summary_income="None"
    )
    
    # Check if exists
    existing = db.query(HousingNotice).filter(HousingNotice.title == notice.title).first()
    if existing:
        db.delete(existing)
        db.commit()
        
    db.add(notice)
    db.commit()
    db.close()
    print("Saved to DB successfully.")

if __name__ == "__main__":
    verify_and_insert()
