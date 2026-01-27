from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'housing.db')}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class HousingNotice(Base):
    __tablename__ = "housing_notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    platform = Column(String)  # SH or LH
    link = Column(String, unique=True, index=True)
    notice_date = Column(DateTime)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    announcement_date = Column(DateTime)
    target_group = Column(String) # Youth, Newlyweds, etc.
    income_requirement = Column(Text)
    region = Column(String) # District (Gu)
    address = Column(String)
    deposit = Column(Integer)
    deposit = Column(Integer)
    rent = Column(Integer)
    area = Column(Float, nullable=True) # Size in m2
    # New fields
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    summary_qualifications = Column(Text, nullable=True) # 요약된 자격 요건
    summary_income = Column(Text, nullable=True) # 요약된 소득 요건
    summary_assets = Column(Text, nullable=True) # 요약된 자산 요건 (New)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class GeocodingLog(Base):
    __tablename__ = "geocoding_logs"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, index=True)
    status = Column(String) # SUCCESS, FAILED
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class MarketPrice(Base):
    __tablename__ = "market_prices"

    id = Column(Integer, primary_key=True, index=True)
    region_code = Column(String, index=True)
    legal_name = Column(String, index=True) # Dong
    building_type = Column(String) # Apartment, Officetel, etc.
    avg_deposit = Column(Integer)
    avg_rent = Column(Integer)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    notice_id = Column(Integer, index=True)
    market_price_id = Column(Integer, index=True)
    price_diff_percent = Column(Float)
    score = Column(Float) # 1-5
    summary = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
