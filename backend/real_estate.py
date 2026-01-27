import requests
import os
import datetime
import math

# SEOUL_DATA_KEY should be set in environment variables
SEOUL_DATA_KEY = os.getenv("SEOUL_DATA_KEY", "")

def get_market_price(legal_dong, area_m2):
    """
    Fetches real estate transaction data from Seoul Open Data Plaza.
    Service: tbLnOpendataRtmsV (Seoul Real Estate Actual Transaction Price)
    Returns dictionary with average deposit/rent for similar area in the region.
    API: http://openapi.seoul.go.kr:8088/{KEY}/json/tbLnOpendataRtmsV/1/1000/
    """
    if not SEOUL_DATA_KEY:
        print("SEOUL_DATA_KEY is missing. Returning 0.")
        return {"avg_deposit": 0, "avg_rent": 0}

    # API Request
    # Note: The API does not allow filtering by dong directly in the URL efficiently for all years.
    # However, we can fetch recent data. For efficiency in this demo, we fetch a batch.
    # In production, we'd need a better strategy or a pre-collected DB.
    # Here, we will try to fetch recent 1000 records and filter in memory (Optimization needed later)
    
    url = f"http://openapi.seoul.go.kr:8088/{SEOUL_DATA_KEY}/json/tbLnOpendataRtmsV/1/1000/"
    
    try:
        response = requests.get(url)
        if response.status_code != 200:
            print(f"API Error: {response.status_code}")
            return {"avg_deposit": 0, "avg_rent": 0}
            
        data = response.json()
        if 'tbLnOpendataRtmsV' not in data:
            return {"avg_deposit": 0, "avg_rent": 0}
            
        rows = data['tbLnOpendataRtmsV']['row']
        
        # Filter Logic
        # 1. Match Legal Dong (BJDONG_NM) - e.g. "삼성동"
        # 2. Match Area (BLDG_AREA) - +/- 10% tolerance
        # 3. Match Year (DEAL_YMD) - recent 1 year (optional, data usually sorted)
        
        relevant_items = []
        target_area = float(area_m2)
        
        for item in rows:
            # Check Dong
            if item.get('BJDONG_NM') != legal_dong:
                continue
                
            # Check Area
            try:
                item_area = float(item.get('BLDG_AREA', 0))
                if not (target_area * 0.8 <= item_area <= target_area * 1.2):
                    continue
            except:
                continue
                
            # Check Type (Apartment / Officetel / Multi-household)
            # HOUSE_TYPE: '아파트', '오피스텔', '연립다세대', '단독다가구'
            # For simplicity, we include all relevant types or filter if needed
            
            rent_money = int(item.get('RENT_GTN', '0').replace(',', '')) # 보증금
            monthly_money = int(item.get('RENT_FEE', '0').replace(',', '')) # 월세
            
            # Simple conversion to "Jeonse Equivalent" could be done, 
            # but for now we just return avg of deposit/rent separately.
            
            relevant_items.append({
                "deposit": rent_money,
                "rent": monthly_money
            })
            
        if not relevant_items:
            return {"avg_deposit": 0, "avg_rent": 0}
            
        avg_deposit = sum(i['deposit'] for i in relevant_items) / len(relevant_items)
        avg_rent = sum(i['rent'] for i in relevant_items) / len(relevant_items)
        
        return {
            "avg_deposit": round(avg_deposit),
            "avg_rent": round(avg_rent)
        }
        
    except Exception as e:
        print(f"Real Estate API Exception: {e}")
        return {"avg_deposit": 0, "avg_rent": 0}
