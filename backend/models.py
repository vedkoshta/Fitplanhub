from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class UserRole(str, enum.Enum):
    trainer = "trainer"
    user = "user"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.user, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    fitness_plans = relationship("FitnessPlan", back_populates="trainer")
    subscriptions = relationship("Subscription", back_populates="user")
    following = relationship("TrainerFollow", foreign_keys="TrainerFollow.user_id", back_populates="user")
    followers = relationship("TrainerFollow", foreign_keys="TrainerFollow.trainer_id", back_populates="trainer")

class FitnessPlan(Base):
    __tablename__ = "fitness_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String(2000), nullable=False)
    price = Column(Float, nullable=False)
    duration_days = Column(Integer, nullable=False)
    trainer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    trainer = relationship("User", back_populates="fitness_plans")
    subscriptions = relationship("Subscription", back_populates="plan")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("fitness_plans.id"), nullable=False)
    subscribed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="subscriptions")
    plan = relationship("FitnessPlan", back_populates="subscriptions")

class TrainerFollow(Base):
    __tablename__ = "trainer_follows"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trainer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", foreign_keys=[user_id], back_populates="following")
    trainer = relationship("User", foreign_keys=[trainer_id], back_populates="followers")
