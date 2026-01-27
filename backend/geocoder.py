import requests
import os
from database import SessionLocal, GeocodingLog
import datetime

KAKAO_API_KEY = os.getenv("KAKAO_API_KEY", "")

def get_coordinates(address):
    if not KAKAO_API_KEY:
        log_failure(address, "Kakao API Key missing")
        return None, None

    url = "https://dapi.kakao.com/v2/local/search/address.json"
    headers = {"Authorization": f"KakaoAK {KAKAO_API_KEY}"}
    params = {"query": address}

    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            if data['documents']:
                lat = data['documents'][0]['y']
                lng = data['documents'][0]['x']
                return float(lat), float(lng)
            else:
                log_failure(address, "No results found")
                return None, None
        else:
            log_failure(address, f"API Error: {response.status_code}")
            return None, None
    except Exception as e:
        log_failure(address, str(e))
        return None, None

def log_failure(address, error_message):
    db = SessionLocal()
    log = GeocodingLog(
        address=address,
        status="FAILED",
        error_message=error_message
    )
    db.add(log)
    db.commit()
    db.close()
