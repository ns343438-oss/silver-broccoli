import unittest
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from file_parser import RegexParser

SAMPLE_NOTICE_TEXT = """
[공고] 2026년 청년 매입임대주택 입주자 모집 공고
공고일: 2026-02-01
신청기간: 2026.02.10 ~ 2026.02.15

1. 신청자격
- 무주택 세대구성원으로서 만 19세 이상 39세 이하인 청년
- 월평균 소득 100% 이하 (1인 가구 기준 3,500,000원)

2. 임대조건
- 보증금: 1,000만원
- 월임대료: 150,000원
- 전환보증금 최대 50% 가능 (이율 6.0%)

3. 공급일정
- 당첨자 발표: 2026-03-20
"""

class TestRegexParser(unittest.TestCase):
    def setUp(self):
        self.parser = RegexParser()
        self.result = self.parser.parse(SAMPLE_NOTICE_TEXT)
        print(f"\nParse Result: {self.result}")

    def test_extract_dates(self):
        dates = self.result['dates']
        self.assertIn("2026-02-01", dates)
        self.assertIn("2026-02-10", dates)
        self.assertIn("2026-02-15", dates)
        self.assertIn("2026-03-20", dates)

    def test_extract_amounts(self):
        amounts = self.result['amounts']
        # Check tuples
        # 1,000만원 -> 10,000,000.0
        self.assertIn(("1,000만원", 10000000.0), amounts)
        # 150,000원 -> 150,000.0
        self.assertIn(("150,000원", 150000.0), amounts) # Typo check in logic?

    def test_extract_keywords(self):
        keywords = self.result['keywords']
        self.assertIn("무주택", keywords['qualifications'])
        self.assertIn("청년", keywords['qualifications'])
        self.assertIn("소득", keywords['income'])

if __name__ == '__main__':
    unittest.main()
