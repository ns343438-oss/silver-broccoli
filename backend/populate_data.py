from backend.database import SessionLocal, HousingNotice, init_db
from datetime import datetime, timedelta
import random

# Initialize DB (just in case)
init_db()

db = SessionLocal()

# clear existing
# db.query(HousingNotice).delete()
# db.commit()

# Mock Data
notices = [
    {
        "title": "[TEST] 2025년 2차 청년매입임대주택 입주자 모집공고",
        "platform": "SH",
        "date": datetime.now(),
        "start": datetime.now(),
        "end": datetime.now() + timedelta(days=7),
        "region": "Gangnam-gu",
        "address": "서울시 강남구 삼성동 123",
        "lat": 37.514575,
        "lng": 127.0495556,
        "score": 4.5
    },
    {
        "title": "[TEST] 2025년 신혼부부 전세임대 모집",
        "platform": "LH",
        "date": datetime.now() - timedelta(days=2),
        "start": datetime.now() - timedelta(days=1),
        "end": datetime.now() + timedelta(days=14),
        "region": "Mapo-gu",
        "address": "서울시 마포구 합정동 456",
        "lat": 37.549906,
        "lng": 126.913773,
        "score": 3.8
    },
    {
        "title": "[EXPIRED] 2024년 역세권 청년주택 (종료된 공고)",
        "platform": "SH",
        "date": datetime.now() - timedelta(days=60),
        "start": datetime.now() - timedelta(days=40),
        "end": datetime.now() - timedelta(days=30),
        "region": "Songpa-gu",
        "address": "서울시 송파구 잠실동 789",
        "lat": 37.5132612,
        "lng": 127.1001336,
        "score": 2.5
    },
    {
        "title": "[TEST] 강북구 수유동 행복주택",
        "platform": "SH",
        "date": datetime.now(),
        "start": datetime.now() + timedelta(days=2),
        "end": datetime.now() + timedelta(days=10),
        "region": "Gangbuk-gu",
        "address": "서울시 강북구 수유동 101",
        "lat": 37.6397819,
        "lng": 127.0256135,
        "score": 4.0
    }
]

for item in notices:
    notice = HousingNotice(
        title=item["title"],
        platform=item["platform"],
        notice_date=item["date"],
        link=f"http://example.com/{random.randint(1000,9999)}",
        start_date=item["start"],
        end_date=item["end"],
        region=item["region"],
        address=item["address"],
        deposit=50000000,
        rent=300000,
        lat=item["lat"],
        lng=item["lng"],
        summary_qualifications="테스트 자격 요건입니다.",
        summary_income="테스트 소득 요건입니다."
    )
    db.add(notice)

db.commit()
db.close()
print(f"Inserted {len(notices)} mock notices.")
