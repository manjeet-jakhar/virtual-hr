from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# 🔥 CREATE TASK (FIXED)
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None   # ✅ FIXED (optional)
    priority: Optional[str] = None      # ✅ FIXED (optional)
    assigned_to: str                   # ✅ REQUIRED


# 🔥 UPDATE TASK
class TaskUpdate(BaseModel):
    status: str


# 🔥 INTERVIEW CREATE
class InterviewCreate(BaseModel):
    candidate_name: str
    scheduled_time: datetime
    mode: str


# 🔥 TASK RESPONSE
class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# 🔥 INTERVIEW RESPONSE
class InterviewResponse(BaseModel):
    id: int
    candidate_name: str
    scheduled_time: datetime
    mode: str
    created_at: datetime

    class Config:
        from_attributes = True


# 🔥 INTERVIEW + CALL ROOM
class InterviewWithRoom(BaseModel):
    interview: InterviewResponse
    call_room: str