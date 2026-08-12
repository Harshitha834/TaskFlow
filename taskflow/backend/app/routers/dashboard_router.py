"""
Dashboard summary endpoint: aggregate stats for the authenticated user.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.models import Project, Task, TaskStatus, User
from app.schemas.schemas import DashboardOut
from app.utils.deps import get_current_user

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard", response_model=DashboardOut)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project_ids = [
        p.id for p in db.query(Project.id).filter(Project.owner_id == current_user.id).all()
    ]

    base_task_query = db.query(Task).filter(Task.project_id.in_(project_ids))

    total_projects = len(project_ids)
    total_tasks = base_task_query.count()
    pending_tasks = base_task_query.filter(Task.status == TaskStatus.PENDING).count()
    in_progress_tasks = base_task_query.filter(Task.status == TaskStatus.IN_PROGRESS).count()
    completed_tasks = base_task_query.filter(Task.status == TaskStatus.COMPLETED).count()

    now = datetime.now(timezone.utc)
    overdue_tasks = base_task_query.filter(
        Task.due_date.isnot(None),
        Task.due_date < now,
        Task.status != TaskStatus.COMPLETED,
    ).count()

    recent_tasks = base_task_query.order_by(Task.created_at.desc()).limit(5).all()
    upcoming_deadlines = (
        base_task_query.filter(Task.due_date.isnot(None), Task.due_date >= now)
        .order_by(Task.due_date.asc())
        .limit(5)
        .all()
    )

    return DashboardOut(
        total_projects=total_projects,
        total_tasks=total_tasks,
        pending_tasks=pending_tasks,
        in_progress_tasks=in_progress_tasks,
        completed_tasks=completed_tasks,
        overdue_tasks=overdue_tasks,
        recent_tasks=recent_tasks,
        upcoming_deadlines=upcoming_deadlines,
    )
