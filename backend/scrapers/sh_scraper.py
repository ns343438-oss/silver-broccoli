from playwright.sync_api import sync_playwright
from datetime import datetime
import hashlib
from .base_scraper import BaseScraper
# Import locally to avoid circular dependency if needed, or adjust python path
# Assuming backend is in path
try:
    from file_parser import RegexParser
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from file_parser import RegexParser

class SHScraper(BaseScraper):
    def scrape(self):
        print("Starting SH Scraping (Deep Mode)...")
        results = []
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(user_agent="Mozilla/5.0")
            page = context.new_page()
            
            # Real SH List URL
            url = "https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_241/list.do" 
            try:
                page.goto(url, timeout=30000)
                page.wait_for_timeout(2000)
            except:
                print("Failed to load SH page")
                return []

            try:
                # Find target table
                tables = page.locator("table").all()
                target_table = None
                
                for tbl in tables:
                    if tbl.locator("tbody tr").count() > 3 and "번호" in tbl.inner_text():
                        target_table = tbl
                        break
                
                if not target_table:
                    if len(tables) > 1: target_table = tables[1]
                    else: target_table = tables[0]

                # Iterate first 10 rows
                count = 0 
                rows = target_table.locator("tbody tr").all()
                
                for row in rows:
                    if count > 10: break
                    
                    try:
                        title_el = row.locator("a").first
                        title = title_el.inner_text().strip()
                        
                        if "임대" in title or "모집" in title:
                            count += 1
                            print(f"Processing: {title}")
                            
                            # Extract Date
                            date_str = datetime.utcnow().strftime("%Y-%m-%d")
                            try:
                                 cells = row.locator("td").all()
                                 for cell in cells:
                                     txt = cell.inner_text().strip()
                                     if "202" in txt and "-" in txt:
                                         date_str = txt
                                         break
                            except:
                                pass

                            # Get Link
                            href = title_el.get_attribute("href")
                            detail_url = ""
                            if "http" in href:
                                detail_url = href
                            elif "javascript" not in href and href != "#":
                                detail_url = "https://www.i-sh.co.kr" + href
                            else:
                                hash_str = hashlib.md5(title.encode()).hexdigest()
                                detail_url = f"https://www.i-sh.co.kr/mock/{hash_str}"
                            
                            # Region Logic
                            matches = {
                                "강남": "Gangnam-gu", "서초": "Seocho-gu", "송파": "Songpa-gu", "강동": "Gangdong-gu",
                                "마포": "Mapo-gu", "용산": "Yongsan-gu", "성동": "Seongdong-gu", "광진": "Gwangjin-gu",
                                "강북": "Gangbuk-gu", "도봉": "Dobong-gu", "노원": "Nowon-gu", "은평": "Eunpyeong-gu",
                                "서대문": "Seodaemun-gu", "동대문": "Dongdaemun-gu", "중랑": "Jungnang-gu", "성북": "Seongbuk-gu",
                                "양천": "Yangcheon-gu", "강서": "Gangseo-gu", "구로": "Guro-gu", "금천": "Geumcheon-gu",
                                "영등포": "Yeongdeungpo-gu", "동작": "Dongjak-gu", "관악": "Gwanak-gu", "종로": "Jongno-gu",
                                "중구": "Jung-gu"
                            }
                            
                            region = "Seoul"
                            for key, val in matches.items():
                                if key in title:
                                    region = val
                                    break
                            
                            if region == "Seoul":
                                addr = "서울시청"
                            else:
                                addr = f"서울시 {region}청"
                            
                            # Parser Logic
                            parser = RegexParser()
                            title_parsed = parser.parse(title)
                            
                            area = max(title_parsed['areas']) if title_parsed['areas'] else 25.0
                            
                            deposit = 0
                            rent = 0
                            if title_parsed['amounts']:
                                 vals = [v for _, v in title_parsed['amounts']]
                                 if vals:
                                     deposit = max(vals)
                                     rent = min(vals) if len(vals) > 1 else 0

                            # Date Logic
                            start_date = datetime.utcnow()
                            end_date = datetime.utcnow()
                            
                            parsed_dates = title_parsed['dates']
                            if parsed_dates:
                                try:
                                    p_dates = sorted([datetime.strptime(d, "%Y-%m-%d") for d in parsed_dates])
                                    if len(p_dates) >= 2:
                                        start_date = p_dates[0]
                                        end_date = p_dates[-1]
                                    elif len(p_dates) == 1:
                                        start_date = p_dates[0]
                                        from datetime import timedelta
                                        end_date = start_date + timedelta(days=14)
                                except:
                                    pass
                            
                            # Fallback Dates
                            if not parsed_dates and date_str:
                                 try:
                                     start_date = datetime.strptime(date_str, "%Y-%m-%d")
                                     from datetime import timedelta
                                     end_date = start_date + timedelta(days=14)
                                 except:
                                     pass

                            # Mock Sections
                            sections = {
                                "qualifications": "무주택 세대구성원, 소득 100% 이하",
                                "income": "월평균 소득 70% 이하 (1인 가구 300만원)",
                                "assets": "총자산 3.4억 이하, 자동차 3,708만원 이하"
                            }

                            results.append({
                                "title": title,
                                "date": date_str,
                                "link": detail_url,
                                "start_date": start_date,
                                "end_date": end_date,
                                "platform": "SH",
                                "region": region,
                                "address": addr,
                                "area": area,
                                "deposit": deposit,
                                "rent": rent,
                                "qualifications": sections['qualifications'],
                                "income": sections['income'],
                                "assets": sections['assets']
                            })
                            
                    except Exception as e:
                        print(f"Row processing error: {e}")
                        
            except Exception as e:
                print(f"Scraping Loop Error: {e}")

            browser.close()
        return results
