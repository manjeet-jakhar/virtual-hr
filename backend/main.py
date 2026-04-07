from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
from datetime import datetime

# 🔥 EMAIL IMPORTS
import smtplib
from email.mime.text import MIMEText


# Create DB tables
models.Base.metadata.create_all(bind=engine)

# Initialize app
app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔥 EMAIL FUNCTION
def send_email(to_email, subject, body):
    sender_email = "your_email@gmail.com"   # 🔥 change
    sender_password = "your_app_password"   # 🔥 app password

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        print("✅ Email sent")
    except Exception as e:
        print("❌ Email error:", e)


# ---------------- TASK APIs ---------------- #

@app.post("/tasks/", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        assigned_to=task.assigned_to,
        status="Pending"
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    activity = models.Activity(message=f"Task Created: {new_task.title}")
    db.add(activity)
    db.commit()

    return new_task


@app.get("/tasks/", response_model=list[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()


@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = update.status

    if update.status == "Completed":
        task.completed_at = datetime.utcnow()

    db.commit()

    activity = models.Activity(message=f"Task {task.title} marked {update.status}")
    db.add(activity)
    db.commit()

    return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}


# ---------------- INTERVIEW APIs ---------------- #

@app.post("/interviews/", response_model=schemas.InterviewWithRoom)
def schedule_interview(interview: schemas.InterviewCreate, db: Session = Depends(get_db)):
    new_interview = models.Interview(**interview.dict())
    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)

    # 🔥 Activity
    activity = models.Activity(message=f"Interview scheduled for {new_interview.candidate_name}")
    db.add(activity)
    db.commit()

    # 🔥 CALL LINK
    call_link = f"https://virtual-hr.vercel.app/call-room/{new_interview.id}"

    # 🔥 SEND EMAIL
    send_email(
        to_email="employer@gmail.com",  # 🔥 change if dynamic later
        subject="📢 Interview Scheduled",
        body=f"""
Hello,

An interview has been scheduled.

Candidate: {new_interview.candidate_name}
Time: {new_interview.scheduled_time}
Mode: {new_interview.mode}

Join Interview:
{call_link}

Best Regards,
HR Team
"""
    )

    return {
        "interview": new_interview,
        "call_room": f"/call-room/{new_interview.id}"
    }


@app.get("/interviews/")
def get_interviews(db: Session = Depends(get_db)):
    return db.query(models.Interview).all()


# ---------------- ACTIVITY ---------------- #

@app.get("/activities/")
def get_activities(db: Session = Depends(get_db)):
    return db.query(models.Activity).all()


# ---------------- LOGIN ---------------- #

users = {
    "employer@gmail.com": {"password": "1234", "role": "employer"},
    "hr@gmail.com": {"password": "1234", "role": "hr"},
}


@app.post("/login/")
def login(data: dict):
    user = users.get(data.get("email"))

    if user and user["password"] == data.get("password"):
        return {"success": True, "role": user["role"]}

    return {"success": False, "message": "Invalid credentials"}