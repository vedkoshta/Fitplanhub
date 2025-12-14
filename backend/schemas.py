from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.user

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

class FitnessPlanCreate(BaseModel):
    title: str
    description: str
    price: float
    duration_days: int

class FitnessPlanUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration_days: Optional[int] = None

class TrainerInfo(BaseModel):
    id: int
    name: str
    email: str
    
    class Config:
        from_attributes = True

class FitnessPlanPreview(BaseModel):
    id: int
    title: str
    price: float
    duration_days: int
    trainer: TrainerInfo
    created_at: datetime
    
    class Config:
        from_attributes = True

class FitnessPlanFull(BaseModel):
    id: int
    title: str
    description: str
    price: float
    duration_days: int
    trainer: TrainerInfo
    created_at: datetime
    is_subscribed: bool = False
    
    class Config:
        from_attributes = True

class SubscriptionResponse(BaseModel):
    id: int
    plan_id: int
    subscribed_at: datetime
    
    class Config:
        from_attributes = True

class TrainerFollowResponse(BaseModel):
    id: int
    trainer: TrainerInfo
    
    class Config:
        from_attributes = True

class TrainerProfile(BaseModel):
    id: int
    name: str
    email: str
    plans: List[FitnessPlanPreview]
    followers_count: int
    is_following: bool = False
    
    class Config:
        from_attributes = True

class FeedItem(BaseModel):
    plan: FitnessPlanPreview
    is_purchased: bool
    trainer: TrainerInfo
    
    class Config:
        from_attributes = True
