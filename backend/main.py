from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import init_db, SessionLocal, HousingNotice
from scheduler import start_scheduler
import contextlib

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    start_scheduler()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Seoul Rental Housing Analysis Server"}

@app.get("/notices")
def get_notices(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    region: str = None
):
    query = db.query(HousingNotice)
    if region:
        query = query.filter(HousingNotice.region == region)
    
    notices = query.offset(skip).limit(limit).all()
    return notices

@app.post("/force-scrape")
def force_scrape(background_tasks: BackgroundTasks):
    from scraper import run_scraping_job
    background_tasks.add_task(run_scraping_job)
    return {"message": "Scraping job started in background"}
