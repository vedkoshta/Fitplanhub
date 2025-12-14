from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, FitnessPlan
from schemas import FitnessPlanCreate, FitnessPlanUpdate, FitnessPlanFull
from auth import require_trainer

router = APIRouter(prefix="/trainer", tags=["Trainer"])

@router.post("/plans", response_model=FitnessPlanFull)
def create_plan(plan_data: FitnessPlanCreate, trainer: User = Depends(require_trainer), db: Session = Depends(get_db)):
    new_plan = FitnessPlan(
        title=plan_data.title,
        description=plan_data.description,
        price=plan_data.price,
        duration_days=plan_data.duration_days,
        trainer_id=trainer.id
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return new_plan

@router.get("/plans", response_model=List[FitnessPlanFull])
def get_trainer_plans(trainer: User = Depends(require_trainer), db: Session = Depends(get_db)):
    plans = db.query(FitnessPlan).filter(FitnessPlan.trainer_id == trainer.id).all()
    return plans

@router.put("/plans/{plan_id}", response_model=FitnessPlanFull)
def update_plan(plan_id: int, plan_data: FitnessPlanUpdate, trainer: User = Depends(require_trainer), db: Session = Depends(get_db)):
    plan = db.query(FitnessPlan).filter(FitnessPlan.id == plan_id, FitnessPlan.trainer_id == trainer.id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found or you don't have permission to edit it"
        )
    
    if plan_data.title is not None:
        plan.title = plan_data.title
    if plan_data.description is not None:
        plan.description = plan_data.description
    if plan_data.price is not None:
        plan.price = plan_data.price
    if plan_data.duration_days is not None:
        plan.duration_days = plan_data.duration_days
    
    db.commit()
    db.refresh(plan)
    return plan

@router.delete("/plans/{plan_id}")
def delete_plan(plan_id: int, trainer: User = Depends(require_trainer), db: Session = Depends(get_db)):
    plan = db.query(FitnessPlan).filter(FitnessPlan.id == plan_id, FitnessPlan.trainer_id == trainer.id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found or you don't have permission to delete it"
        )
    
    db.delete(plan)
    db.commit()
    return {"message": "Plan deleted successfully"}
