"""
Task CRUD endpoints, scoped through project ownership so users can only
manage tasks that belong to their own projects.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload

from app.database.database import get_db
from app.models.models import Task, Project, User, TaskStatus, TaskPriority
from app.schemas.schemas import TaskCreate, TaskUpdate, TaskOut
from app.utils.deps import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])


def _assert_project_ownership(db: Session, project_id: int, current_user: User) -> Project:
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.owner_id == current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


def _get_owned_task(task_id: int, db: Session, current_user: User) -> Task:
    task = (
        db.query(Task)
        .join(Project)
        .filter(Task.id == task_id, Project.owner_id == current_user.id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.get("", response_model=list[TaskOut])
def list_tasks(
    search: Optional[str] = Query(None, description="Search by task title"),
    status_filter: Optional[TaskStatus] = Query(None, alias="status"),
    priority: Optional[TaskPriority] = Query(None),
    project_id: Optional[int] = Query(None),
    sort_by: Optional[str] = Query("created_at", description="created_at | due_date | priority"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Task)
        .join(Project)
        .filter(Project.owner_id == current_user.id)
    )
    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))
    if status_filter:
        query = query.filter(Task.status == status_filter)
    if priority:
        query = query.filter(Task.priority == priority)
    if project_id:
        query = query.filter(Task.project_id == project_id)

    sort_column = {
        "due_date": Task.due_date,
        "priority": Task.priority,
        "created_at": Task.created_at,
    }.get(sort_by, Task.created_at)

    return query.order_by(sort_column.desc()).all()


@router.get("/{task_id}", response_model=TaskOut)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _get_owned_task(task_id, db, current_user)


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _assert_project_ownership(db, payload.project_id, current_user)
    task = Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = _get_owned_task(task_id, db, current_user)
    data = payload.model_dump(exclude_unset=True)
    if "project_id" in data:
        _assert_project_ownership(db, data["project_id"], current_user)
    for field, value in data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = _get_owned_task(task_id, db, current_user)
    db.delete(task)
    db.commit()
    return None
