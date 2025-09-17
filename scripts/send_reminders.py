#!/usr/bin/env python3
"""
Email reminder script for missing student submissions.
This script can be used to send email reminders to students who haven't submitted their projects.
"""

import smtplib
import json
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from pathlib import Path

# Email configuration (use environment variables for security)
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
EMAIL_USER = os.getenv('EMAIL_USER', '')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '')
FROM_EMAIL = os.getenv('FROM_EMAIL', EMAIL_USER)

# Student roster
STUDENT_ROSTER = [
    {"id": "STU001", "name": "Alex Johnson", "email": "alex.johnson@example.com"},
    {"id": "STU002", "name": "Jordan Smith", "email": "jordan.smith@example.com"},
    {"id": "STU003", "name": "Taylor Brown", "email": "taylor.brown@example.com"},
    {"id": "STU004", "name": "Casey Wilson", "email": "casey.wilson@example.com"},
    {"id": "STU005", "name": "Morgan Davis", "email": "morgan.davis@example.com"},
]

def get_submitted_students():
    """Get list of students who have already submitted."""
    submissions_dir = Path("public/submissions")
    submitted_students = []
    
    if submissions_dir.exists():
        for json_file in submissions_dir.glob("*.json"):
            try:
                with open(json_file, 'r') as f:
                    submission = json.load(f)
                    submitted_students.append(submission['studentId'])
            except (json.JSONDecodeError, KeyError) as e:
                print(f"Error reading {json_file}: {e}")
    
    return submitted_students

def create_reminder_email(student):
    """Create reminder email content for a student."""
    due_date = datetime.now() + timedelta(days=7)
    due_date_str = due_date.strftime("%A, %B %d, %Y")
    
    subject = "🔔 Reminder: Cognitive Skills Dashboard Project Due Soon"
    
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #059669;">Project Submission Reminder</h2>
            
            <p>Dear {student['name']},</p>
            
            <p>This is a friendly reminder that your <strong>Cognitive Skills & Student Performance Dashboard</strong> project is due on <strong>{due_date_str}</strong>.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #059669; margin-top: 0;">Required Deliverables:</h3>
                <ul style="margin: 10px 0;">
                    <li>📊 Synthetic student dataset (<code>data/students.csv</code>)</li>
                    <li>📓 Jupyter analysis notebook (<code>notebooks/analysis.ipynb</code>)</li>
                    <li>📄 Exported PDF report (<code>notebooks/analysis.pdf</code>)</li>
                    <li>🤖 Trained ML model (<code>models/final_model.pkl</code>)</li>
                    <li>🐍 Prediction script (<code>src/predict.py</code>)</li>
                    <li>🌐 Next.js dashboard with API routes</li>
                    <li>⚙️ GitHub Actions workflow</li>
                </ul>
            </div>
            
            <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #0066cc; margin-top: 0;">📋 Submission Instructions:</h4>
                <ol>
                    <li>Package all files in a ZIP archive</li>
                    <li>Visit the <a href="http://localhost:3000/submission" style="color: #059669;">submission portal</a></li>
                    <li>Fill out the submission form</li>
                    <li>Upload your ZIP file</li>
                </ol>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to reach out.</p>
            
            <p>Best regards,<br>
            <strong>Course Instructor</strong></p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">
                Student ID: {student['id']}<br>
                This is an automated reminder. Please do not reply to this email.
            </p>
        </div>
    </body>
    </html>
    """
    
    text_body = f"""
    Project Submission Reminder
    
    Dear {student['name']},
    
    This is a friendly reminder that your Cognitive Skills & Student Performance Dashboard project is due on {due_date_str}.
    
    Required Deliverables:
    - Synthetic student dataset (data/students.csv)
    - Jupyter analysis notebook (notebooks/analysis.ipynb)
    - Exported PDF report (notebooks/analysis.pdf)
    - Trained ML model (models/final_model.pkl)
    - Prediction script (src/predict.py)
    - Next.js dashboard with API routes
    - GitHub Actions workflow
    
    Submission Instructions:
    1. Package all files in a ZIP archive
    2. Visit the submission portal: http://localhost:3000/submission
    3. Fill out the submission form
    4. Upload your ZIP file
    
    If you have any questions or need assistance, please don't hesitate to reach out.
    
    Best regards,
    Course Instructor
    
    ---
    Student ID: {student['id']}
    This is an automated reminder. Please do not reply to this email.
    """
    
    return subject, html_body, text_body

def send_email(to_email, subject, html_body, text_body):
    """Send email to a student."""
    if not EMAIL_USER or not EMAIL_PASSWORD:
        print("❌ Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD environment variables.")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        
        # Add text and HTML parts
        text_part = MIMEText(text_body, 'plain')
        html_part = MIMEText(html_body, 'html')
        
        msg.attach(text_part)
        msg.attach(html_part)
        
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)
        
        return True
        
    except Exception as e:
        print(f"❌ Error sending email to {to_email}: {e}")
        return False

def main():
    """Main function to send reminders to students with missing submissions."""
    print("🔍 Checking for missing submissions...")
    
    # Get students who have submitted
    submitted_students = get_submitted_students()
    print(f"✅ Found {len(submitted_students)} submitted projects")
    
    # Find students who haven't submitted
    missing_students = [
        student for student in STUDENT_ROSTER 
        if student['id'] not in submitted_students
    ]
    
    if not missing_students:
        print("🎉 All students have submitted their projects!")
        return
    
    print(f"⚠️  Found {len(missing_students)} students with missing submissions:")
    for student in missing_students:
        print(f"   - {student['name']} ({student['id']})")
    
    # Ask for confirmation before sending emails
    if EMAIL_USER and EMAIL_PASSWORD:
        response = input(f"\n📧 Send reminder emails to {len(missing_students)} students? (y/N): ")
        if response.lower() != 'y':
            print("📧 Email sending cancelled.")
            return
        
        # Send reminder emails
        sent_count = 0
        for student in missing_students:
            print(f"📧 Sending reminder to {student['name']} ({student['email']})...")
            
            subject, html_body, text_body = create_reminder_email(student)
            
            if send_email(student['email'], subject, html_body, text_body):
                print(f"   ✅ Email sent successfully")
                sent_count += 1
            else:
                print(f"   ❌ Failed to send email")
        
        print(f"\n📊 Summary: {sent_count}/{len(missing_students)} reminder emails sent successfully")
    else:
        print("\n📧 Email credentials not configured. To send emails:")
        print("   export EMAIL_USER='your-email@gmail.com'")
        print("   export EMAIL_PASSWORD='your-app-password'")
        print("   python scripts/send_reminders.py")

if __name__ == "__main__":
    main()
