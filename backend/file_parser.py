import re
import platform
import subprocess
import os
import pdfplumber

class RegexParser:
    def __init__(self):
        # Date Patterns: YYYY-MM-DD, YYYY.MM.DD, YY.MM.DD
        self.date_pattern = re.compile(r'(\d{2,4}[\.\-/]\d{1,2}[\.\-/]\d{1,2})')
        
        # Money Patterns: 
        # "1,000만원", "1억 2000", "500000원", "3,500"
        self.money_pattern = re.compile(r'([\d,]+)\s*(억원|만원|천원|억|만|천|원)?')
         
        # Area Patterns: "50m2", "84.5㎡", "25평"
        self.area_pattern = re.compile(r'(\d+(?:\.\d+)?)\s*(?:m2|㎡|평)')

        # Keywords
        self.qual_keywords = ["무주택", "세대구성원", "청년", "신혼부부", "한부모", "고령자"]
        self.income_keywords = ["소득", "중위소득", "월평균"]

    def normalize_text(self, text):
        if not text: return ""
        # Remove multiple spaces
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def extract_dates(self, text):
        matches = self.date_pattern.findall(text)
        cleaned_dates = []
        for d in matches:
            d = d.replace('.', '-').replace('/', '-')
            parts = d.split('-')
            if len(parts[0]) == 2:
                parts[0] = "20" + parts[0]
            cleaned_dates.append("-".join(parts))
        return cleaned_dates

    def extract_amounts(self, text):
        # Regex to capture number and optional unit
        pattern = re.compile(r'([\d,]+)\s*(억원|만원|천원|억|만|천|원)?')
        matches = pattern.findall(text)
        
        results = []
        
        for val_str, unit in matches:
            raw_val = val_str.replace(',', '')
            if not raw_val.isdigit(): continue
            numeric = float(raw_val)
            
            value = 0
            if unit.startswith('억'):
                value = numeric * 100000000
            elif unit.startswith('만'):
                value = numeric * 10000
            elif unit.startswith('천'):
                value = numeric * 1000
            elif unit == '원':
                value = numeric
            elif not unit and numeric >= 100000:
                # Fallback for raw numbers >= 100,000 (likely money in tables)
                value = numeric
            
            if value > 0:
                results.append((f"{val_str}{unit}", value))
                
        # Simple merging logic for "1억 2000" cases could go here
        # For now, return all found values
        return results

    def extract_area(self, text):
        matches = self.area_pattern.findall(text)
        areas = []
        for a in matches:
             try:
                 val = float(a)
                 if 10 <= val <= 200:
                     areas.append(val)
             except:
                 continue
        return areas if areas else [25.0]

    def extract_keywords(self, text):
        found = {
            "qualifications": [],
            "income": [],
            "assets": []
        }
        
        # Simple keyword matching
        for kw in self.qual_keywords:
            if kw in text:
                found["qualifications"].append(kw)
        for kw in self.income_keywords:
            if kw in text:
                found["income"].append(kw)
                
        # Asset Extraction Logic
        # Look for sentences containing "자산", "자동차", "부동산" and extract the whole line or segment
        lines = text.splitlines() # If text has newlines
        if len(lines) < 2: 
            # If text is normalized, split by sentences? 
            # Or just regex find.
            # "총자산가액 3억 이하"
            pass
            
        assets_keywords = ["자산", "자동차", "부동산", "가액"]
        # Regex to find phrases like "자산 X억 이하", "자동차 X만원 이하"
        # Since text might be dense, let's just grab sentences with these keywords.
        
        # Naive approach: check if keywords exist, if so try to grab context
        # Better: Regex for "자산.*?이하" or similar
        
        # Let's try to extract specific asset limits if possible
        # Pattern: (자산|자동차|부동산).*?([\d,]+(?:억|천?만)?원?)
        
        asset_matches = []
        for kw in assets_keywords:
            if kw in text:
                # Find the sentence or immediate context
                # Find kw and next 20 chars? 
                # Let's find regex matches of "Keyword .... value"
                pattern = re.compile(rf"{kw}[^0-9\n]*([\d,]+(?:억|천?만|원)?)")
                matches = pattern.findall(text)
                for m in matches:
                     asset_matches.append(f"{kw}: {m}")
        
        if asset_matches:
            found["assets"] = list(set(asset_matches)) # Dedup
            
        return found
    
    def parse(self, text):
        text = self.normalize_text(text)
        return {
            "dates": self.extract_dates(text),
            "amounts": self.extract_amounts(text),
            "areas": self.extract_area(text),
            "keywords": self.extract_keywords(text)
        }

def parse_pdf(file_path):
    if not os.path.exists(file_path):
        return ""
    
    full_text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
    except Exception as e:
        print(f"Error parsing PDF {file_path}: {e}")
        return ""
        
    return full_text

def parse_hwp(file_path):
    return ""

def extract_sections(text):
    parser = RegexParser()
    result = parser.parse(text)
    
    max_area = max(result['areas']) if result['areas'] else 25.0
    
    summary_qual = ", ".join(result["keywords"]["qualifications"])
    summary_income = ", ".join(result["keywords"]["income"])
    summary_assets = ", ".join(result["keywords"]["assets"])
    
    return {
        "qualifications": summary_qual if summary_qual else "N/A",
        "income": summary_income if summary_income else "N/A",
        "assets": summary_assets if summary_assets else "N/A",
        "area": max_area
    }
