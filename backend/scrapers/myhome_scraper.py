from .base_scraper import BaseScraper
from datetime import datetime, timedelta
import requests

class MyHomeScraper(BaseScraper):
    def scrape(self):
        print("Starting MyHome API Scraping (Mock)...")
        # Real API: https://www.myhome.go.kr/ (Public Data Portal)
        # We Mock the JSON response here.
        
        results = []
        
        # Mock Data from MyHome
        # This simulates a "Public Rental" notice that might duplicate or be unique
        results.append({
            "title": "[마이홈] 2026년 서울리츠 행복주택 입주자 모집", # Unique
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "link": "https://www.myhome.go.kr/mock/1",
            "start_date": datetime.utcnow() + timedelta(days=2),
            "end_date": datetime.utcnow() + timedelta(days=12),
            "platform": "MyHome",
            "region": "Gangdong-gu",
            "address": "서울시 강동구 명일동",
            "area": 29.0,
            "deposit": 30000000,
            "rent": 100000,
            "qualifications": "대학생, 청년",
            "income": "평균소득 100% 이하",
            "assets": "자산 2.5억 이하"
        })
        
        # This one duplicates LH's "Songpa-gu" one slightly differently?
        # Let's make it unique for now to verify data flow.
        results.append({
            "title": "[마이홈] 서울 2차 역세권 청년주택 공고", 
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "link": "https://www.myhome.go.kr/mock/2",
            "start_date": datetime.utcnow() + timedelta(days=5),
            "end_date": datetime.utcnow() + timedelta(days=15),
            "platform": "MyHome",
            "region": "Mapo-gu",
            "address": "서울시 마포구 합정동",
            "area": 19.0,
            "deposit": 10000000,
            "rent": 50000,
            "qualifications": "청년(19~39세)",
            "income": "본인 소득 120% 이하",
            "assets": "자산 2.8억 이하"
        })

        print(f"MyHome Scraper found {len(results)} items.")
        return results
