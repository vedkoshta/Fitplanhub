from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from database import get_db
from models import User, FitnessPlan, Subscription, TrainerFollow, UserRole
from schemas import TrainerFollowResponse, TrainerProfile, FeedItem, FitnessPlanPreview, TrainerInfo
from auth import get_current_user, get_current_user_optional

router = APIRouter(tags=["Users"])

@router.post("/trainers/{trainer_id}/follow")
def follow_trainer(trainer_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == UserRole.trainer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Trainers cannot follow other trainers"
        )
    
    trainer = db.query(User).filter(User.id == trainer_id, User.role == UserRole.trainer).first()
    if not trainer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainer not found"
        )
    
    if current_user.id == trainer_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot follow yourself"
        )
    
    existing_follow = db.query(TrainerFollow).filter(
        TrainerFollow.user_id == current_user.id,
        TrainerFollow.trainer_id == trainer_id
    ).first()
    
    if existing_follow:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already following this trainer"
        )
    
    new_follow = TrainerFollow(
        user_id=current_user.id,
        trainer_id=trainer_id
    )
    db.add(new_follow)
    db.commit()
    
    return {"message": "Successfully followed trainer"}

@router.delete("/trainers/{trainer_id}/unfollow")
def unfollow_trainer(trainer_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    follow = db.query(TrainerFollow).filter(
        TrainerFollow.user_id == current_user.id,
        TrainerFollow.trainer_id == trainer_id
    ).first()
    
    if not follow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not following this trainer"
        )
    
    db.delete(follow)
    db.commit()
    
    return {"message": "Successfully unfollowed trainer"}

@router.get("/users/me/following")
def get_following(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    follows = db.query(TrainerFollow).filter(TrainerFollow.user_id == current_user.id).all()
    return [{"id": f.id, "trainer": {"id": f.trainer.id, "name": f.trainer.name}} for f in follows]

@router.get("/users/me/feed")
def get_user_feed(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    followed_trainer_ids = db.query(TrainerFollow.trainer_id).filter(
        TrainerFollow.user_id == current_user.id
    ).subquery()
    
    subscribed_plan_ids = db.query(Subscription.plan_id).filter(
        Subscription.user_id == current_user.id
    ).subquery()
    
    plans = db.query(FitnessPlan).filter(
        or_(
            FitnessPlan.trainer_id.in_(followed_trainer_ids),
            FitnessPlan.id.in_(subscribed_plan_ids)
        )
    ).all()
    
    feed_items = []
    for plan in plans:
        is_purchased = db.query(Subscription).filter(
            Subscription.user_id == current_user.id,
            Subscription.plan_id == plan.id
        ).first() is not None
        
        feed_items.append({
            "plan": {
                "id": plan.id,
                "title": plan.title,
                "price": plan.price,
                "duration_days": plan.duration_days,
                "trainer": {
                    "id": plan.trainer.id,
                    "name": plan.trainer.name
                },
                "created_at": plan.created_at
            },
            "is_purchased": is_purchased,
            "trainer": {
                "id": plan.trainer.id,
                "name": plan.trainer.name
            }
        })
    
    return feed_items

@router.get("/trainers/{trainer_id}")
def get_trainer_profile(trainer_id: int, current_user: User = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    trainer = db.query(User).filter(User.id == trainer_id, User.role == UserRole.trainer).first()
    if not trainer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainer not found"
        )
    
    plans = db.query(FitnessPlan).filter(FitnessPlan.trainer_id == trainer_id).all()
    followers_count = db.query(TrainerFollow).filter(TrainerFollow.trainer_id == trainer_id).count()
    
    is_following = False
    if current_user:
        is_following = db.query(TrainerFollow).filter(
            TrainerFollow.user_id == current_user.id,
            TrainerFollow.trainer_id == trainer_id
        ).first() is not None
    
    plans_preview = [{
        "id": p.id,
        "title": p.title,
        "price": p.price,
        "duration_days": p.duration_days,
        "trainer": {
            "id": trainer.id,
            "name": trainer.name
        },
        "created_at": p.created_at
    } for p in plans]
    
    return {
        "id": trainer.id,
        "name": trainer.name,
        "plans": plans_preview,
        "followers_count": followers_count,
        "is_following": is_following
    }

@router.get("/trainers")
def get_all_trainers(db: Session = Depends(get_db)):
    trainers = db.query(User).filter(User.role == UserRole.trainer).all()
    return [{"id": t.id, "name": t.name} for t in trainers]
