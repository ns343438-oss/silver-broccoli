# Seoul Rental Housing Dashboard

This project automates the collection and analysis of rental housing notices from SH and LH, providing a visual dashboard with cost-effectiveness scoring.

## Tech Stack
-   **Backend**: FastAPI, SQLite, Playwright, APScheduler
-   **Frontend**: React (Vite), Tailwind CSS, Kakao Maps API

## Setup Instructions

### Backend
1.  Navigate to `backend/`.
2.  Install dependencies: `pip install -r requirements.txt`.
3.  Install Playwright browser: `playwright install chromium`.
4.  Run server: `uvicorn main:app --reload`.

### Frontend
1.  Navigate to `frontend/`.
2.  Install dependencies: `npm install`.
3.  Run dev server: `npm run dev`.

### API Keys
-   You need a **Kakao Maps API Key**. Add it to the `<script>` tag in `frontend/index.html`.
-   You need a **Seoul Open Data Plaza Key** for real transaction data (configure in `backend/analyzer.py`).

## Features
-   **Daily Automation**: Scrapes and analyzes data every day at 09:00.
-   **Map Visualization**: See housing locations and their scores on the map.
-   **Filtering**: Filter by region and target group.
