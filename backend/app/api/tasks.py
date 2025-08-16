from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.task import Task, TaskStatus
from app.schemas.task import (
    TaskCreate, 
    TaskUpdate, 
    TaskResponse, 
    TaskListResponse, 
    TasksByStatusResponse,
    TaskPositionUpdate
)

router = APIRouter()

@router.get("/", response_model=TaskListResponse)
async def get_tasks(db: Session = Depends(get_db)):
    """全タスク取得"""
    tasks = db.query(Task).order_by(Task.created_at.desc()).all()
    return TaskListResponse(tasks=tasks, total=len(tasks))

@router.get("/by-status", response_model=TasksByStatusResponse)
async def get_tasks_by_status(db: Session = Depends(get_db)):
    """ステータス別タスク取得（カンバンボード用）"""
    tasks = db.query(Task).all()
    
    result = {
        "todo": [],
        "in_progress": [],
        "review": [],
        "done": []
    }
    
    for task in tasks:
        result[task.status.value].append(task)
    
    # 各ステータス内でposition順にソート
    for status_tasks in result.values():
        status_tasks.sort(key=lambda x: x.position)
    
    return TasksByStatusResponse(**result)

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: int, db: Session = Depends(get_db)):
    """タスク詳細取得"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/", response_model=TaskResponse)
async def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    """タスク作成"""
    # 新しいタスクのpositionを設定（同ステータス内の最大値+1）
    max_position = db.query(Task).filter(
        Task.status == task_data.status
    ).count()
    
    db_task = Task(
        **task_data.model_dump(),
        position=max_position + 1
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    """タスク更新"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # 更新データを適用
    for field, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    return task

@router.patch("/{task_id}/position", response_model=TaskResponse)
async def update_task_position(
    task_id: int, 
    position_data: TaskPositionUpdate, 
    db: Session = Depends(get_db)
):
    """タスク位置更新（ドラッグ&ドロップ用）"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    old_status = task.status
    new_status = position_data.status
    new_position = position_data.position
    
    # ステータスが変更された場合の処理
    if old_status != new_status:
        # 元のステータスから削除（position調整）
        db.query(Task).filter(
            Task.status == old_status,
            Task.position > task.position
        ).update({Task.position: Task.position - 1})
        
        # 新しいステータスに挿入（position調整）
        db.query(Task).filter(
            Task.status == new_status,
            Task.position >= new_position
        ).update({Task.position: Task.position + 1})
    else:
        # 同じステータス内での位置変更
        if task.position < new_position:
            # 下に移動
            db.query(Task).filter(
                Task.status == new_status,
                Task.position > task.position,
                Task.position <= new_position
            ).update({Task.position: Task.position - 1})
        elif task.position > new_position:
            # 上に移動
            db.query(Task).filter(
                Task.status == new_status,
                Task.position >= new_position,
                Task.position < task.position
            ).update({Task.position: Task.position + 1})
    
    # タスク自体を更新
    task.status = new_status
    task.position = new_position
    
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    """タスク削除"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # position調整（削除されたタスクより後のものを前に詰める）
    db.query(Task).filter(
        Task.status == task.status,
        Task.position > task.position
    ).update({Task.position: Task.position - 1})
    
    db.delete(task)
    db.commit()
    
    return {"message": "Task deleted successfully", "deleted_id": task_id}
