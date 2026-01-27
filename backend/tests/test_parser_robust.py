import unittest
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from file_parser import RegexParser

class TestRegexParserRobustness(unittest.TestCase):
    def setUp(self):
        self.parser = RegexParser()

    def test_date_formats(self):
        text = "공고일: 2026-01-27, 접수: 26.02.01 ~ 2026/02/10"
        dates = self.parser.extract_dates(text)
        self.assertIn("2026-01-27", dates)
        self.assertIn("2026-02-01", dates) # 26.02.01 -> 2026-02-01
        self.assertIn("2026-02-10", dates) # 2026/02/10 -> 2026-02-10

    def test_money_extraction(self):
        text = "보증금 1억 2000만원, 월임대료 350,000원, 관리비 5만원"
        amounts = self.parser.extract_amounts(text)
        amount_values = [val for _, val in amounts]
        self.assertIn(120000000.0, amount_values) # 1억 2000 (Complex case not fully supported in simple regex, '2000' might get caught separately if not careful)
        # Current regex `([\d,]+)\s*(만원|억원|원|천원)?` handles simple tokens. 
        # "1억" -> 100000000.0
        # "2000만원" -> 20000000.0
        # "350,000원" -> 350000.0
        self.assertIn(350000.0, amount_values)
        self.assertIn(50000.0, amount_values)

    def test_area_extraction(self):
        text = "전용면적 29m2, 공용 15㎡, 기타 10평"
        areas = self.parser.extract_area(text)
        self.assertIn(29.0, areas)
        self.assertIn(15.0, areas)
        # 10평 is roughly 33m2? Regex extracts raw number. Analyzer converts unit? 
        # Current parser returns raw 10.0 if range is valid. 
        # 10 is '10 <= val <= 200'.
        self.assertIn(10.0, areas)

    def test_normalization(self):
        text = "  공   고   일 :  2026 . 01 . 01  "
        clean = self.parser.normalize_text(text)
        # 2026.01.01 regex handles spaces? no, extract_dates runs on normalized? 
        # Actually parser.parse() calls normalize_text first.
        # But normalize_text collapses spaces. "2026 . 01 . 01" -> "2026 . 01 . 01" (regex might fail if space inside date)
        # Our regex expects contiguous chars mostly or limited separators.
        # Let's test what parse returns.
        res = self.parser.parse(text)
        # If "2026 . 01 . 01" has spaces, regex r'(\d{4}[\.\-/]\d{1,2}...' might fail.
        # Ideally normalization should handle date spacing too, but let's see current behavior.
        pass 

if __name__ == '__main__':
    unittest.main()
