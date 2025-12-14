from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import User, FitnessPlan, Subscription
from schemas import FitnessPlanPreview, FitnessPlanFull, SubscriptionResponse
from auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/plans", tags=["Plans"])

@router.get("")
def get_all_plans(db: Session = Depends(get_db)):
    plans = db.query(FitnessPlan).all()
    return [{
        "id": p.id,
        "title": p.title,
        "price": p.price,
        "duration_days": p.duration_days,
        "trainer": {
            "id": p.trainer.id,
            "name": p.trainer.name
        },
        "created_at": p.created_at
    } for p in plans]

@router.get("/{plan_id}")
def get_plan_details(plan_id: int, current_user: Optional[User] = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    plan = db.query(FitnessPlan).filter(FitnessPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    
    is_subscribed = False
    if current_user:
        subscription = db.query(Subscription).filter(
            Subscription.user_id == current_user.id,
            Subscription.plan_id == plan_id
        ).first()
        is_subscribed = subscription is not None
        
        if current_user.id == plan.trainer_id:
            is_subscribed = True
    
    if is_subscribed:
        return {
            "id": plan.id,
            "title": plan.title,
            "description": plan.description,
            "price": plan.price,
            "duration_days": plan.duration_days,
            "trainer": {
                "id": plan.trainer.id,
                "name": plan.trainer.name
            },
            "created_at": plan.created_at,
            "is_subscribed": True
        }
    else:
        return {
            "id": plan.id,
            "title": plan.title,
            "price": plan.price,
            "duration_days": plan.duration_days,
            "trainer": {
                "id": plan.trainer.id,
                "name": plan.trainer.name
            },
            "created_at": plan.created_at,
            "is_subscribed": False
        }

@router.post("/{plan_id}/subscribe", response_model=SubscriptionResponse)
def subscribe_to_plan(plan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.query(FitnessPlan).filter(FitnessPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    
    existing_subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.plan_id == plan_id
    ).first()
    
    if existing_subscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already subscribed to this plan"
        )
    
    new_subscription = Subscription(
        user_id=current_user.id,
        plan_id=plan_id
    )
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    
    return new_subscription
