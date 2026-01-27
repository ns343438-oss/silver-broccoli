from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import time

scheduler = BackgroundScheduler()

def daily_task():
    print("Running daily task: Scraper & Analysis")
    from scraper import run_scraping_job
    from analyzer import run_analysis_job
    
    run_scraping_job()
    run_analysis_job()

def start_scheduler():
    scheduler.add_job(daily_task, CronTrigger(hour=9, minute=0))
    scheduler.start()
