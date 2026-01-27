from playwright.sync_api import sync_playwright

def debug_sh():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        url = "https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_241/list.do"
        print(f"Navigating to {url}...")
        page.goto(url)
        page.wait_for_timeout(3000)
        
        print(f"Page Title: {page.title()}")
        
        # Check if table exists
        tables = page.locator("table").all()
        print(f"Found {len(tables)} tables.")
        
        if len(tables) > 0:
            # Print first 500 chars of first table
            print(f"First Table Text: {tables[0].inner_text()[:500]}")
            
            rows = tables[0].locator("tbody tr").all()
            print(f"Found {len(rows)} rows in first table.")
            
            if len(rows) > 0:
                print(f"First Row HTML: {rows[0].inner_html()}")
        
        browser.close()

if __name__ == "__main__":
    debug_sh()
