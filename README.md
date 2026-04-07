# 🚀 Virtual HR Management System (ATS)

A full-stack Virtual HR platform built using FastAPI and React that enables Employers and HR teams to manage tasks, schedule interviews, and conduct real-time video interviews.

---

## 🌟 Features

- 🔐 Role-based authentication (Employer / HR)
- 📋 Task Management System (Create, Assign, Update)
- 🔄 Bidirectional Task Assignment (HR ↔ Employer)
- 🎯 Priority-based tasks (High, Medium, Low)
- 📅 Interview Scheduling (HR Dashboard)
- 🎥 Real-time Video Interview (WebRTC)
- 🔔 Live Notifications (Dashboard updates)
- 📧 Email Notification system (SMTP - Gmail)
- 📊 Activity Feed (track all actions)

---

## 🛠 Tech Stack

**Frontend:**
- React (Vite)

**Backend:**
- FastAPI
- SQLAlchemy
- SQLite

**Other:**
- WebRTC (PeerJS)
- SMTP (Gmail App Password)
- Deployment: Render + Vercel

---

## ⚙️ Local Setup

### 🔹 Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
