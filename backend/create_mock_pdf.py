from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os

def create_pdf(filename):
    c = canvas.Canvas(filename, pagesize=letter)
    c.drawString(100, 750, "Notice of Vacancy")
    c.drawString(100, 730, "Date: 2026-05-05")
    c.drawString(100, 710, "Target: Youth and Newlyweds")
    c.drawString(100, 690, "Deposit: 50000000")
    c.drawString(100, 670, "Rent: 300000")
    c.drawString(100, 650, "Area: 84m2")
    c.save()
    print(f"Created {filename}")

if __name__ == "__main__":
    create_pdf("backend/mock_notice.pdf")
