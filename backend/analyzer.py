from database import SessionLocal, HousingNotice, AnalysisResult
from real_estate import get_market_price
import math

def calculate_score(market_price, notice_price):
    """
    Strict comparison logic.
    Returns: (score, diff_percent)
    Score: Float with 2 decimal precision (1.00 to 5.00)
    Diff: Float with 2 decimal precision
    """
    if market_price <= 0:
        return 2.50, 0.00 # Neutral if no data

    if notice_price <= 0:
        # If free (rare) or not parsed, assume high score but mark data missing?
        # For now, treat as very cheap
        return 4.50, 100.00

    # Formula: (Market - Notice) / Market * 100
    # Example: (100 - 80) / 100 * 100 = 20% cheaper
    diff_percent = ((market_price - notice_price) / market_price) * 100
    
    # Precise rounding
    diff_percent = round(diff_percent, 2)
    
    # Score Map (Linear interpretation 1-5)
    # 0% diff -> Score 2.5 (Average)
    # +50% diff (Cheaper) -> Score 5.0
    # -50% diff (Expensive) -> Score 0.0 -> impl 1.0 floor
    
    # Base 2.5 + (diff / 20)
    # e.g. 20% diff -> 2.5 + 1.0 = 3.5
    raw_score = 2.5 + (diff_percent / 20.0)
    
    # Clamp 1.0 - 5.0
    final_score = max(1.0, min(5.0, raw_score))
    
    return round(final_score, 2), diff_percent

def analyze_notice(notice, target_area=25.0):
    try:
        legal_dong = notice.address.split(" ")[2]
    except:
        legal_dong = ""
        
    market_data = get_market_price(legal_dong, target_area)
    
    # Compare Rents (Monthly) for simplicity in this prototype
    market_rent = float(market_data['avg_rent'])
    notice_rent = float(notice.rent)
    
    score, diff = calculate_score(market_rent, notice_rent)
    return score, diff

def run_analysis_job():
    db = SessionLocal()
    notices = db.query(HousingNotice).all() 
    
    print("Starting Strict Analysis Job...")
    
    for notice in notices:
        # Check if already analyzed? (Skip for now to force update)
        # existing = db.query(AnalysisResult).filter(AnalysisResult.notice_id == notice.id).first()
        
        # Pass default area or parsed area if available (Currently DB doesn't have area column, use safe default)
        # TODO: Add area column to HousingNotice
        score, diff = analyze_notice(notice, target_area=25.0)
        
        # Upsert logic
        existing = db.query(AnalysisResult).filter(AnalysisResult.notice_id == notice.id).first()
        if existing:
            existing.score = score
            existing.price_diff_percent = diff
            existing.summary = f"Strict analysis: {diff}% cheaper"
        else:
            result = AnalysisResult(
                notice_id=notice.id,
                score=score,
                summary=f"Strict analysis: {diff}% cheaper",
                price_diff_percent=diff
            )
            db.add(result)
    
    db.commit()
    db.close()
    print("Strict Analysis Completed.")
