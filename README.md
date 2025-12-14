🏋️ FitPlanHub – Trainers & Users Fitness Platform

FitPlanHub is a full-stack fitness platform where certified trainers create and publish paid fitness plans, while users can subscribe, follow trainers, and access structured, goal-driven fitness programs.

The project highlights a real-world backend architecture using JWT-based authentication, role-based access control, and a modern React frontend seamlessly integrated with a FastAPI backend.

🚀 Features Overview
🔐 Authentication & Authorization

User and Trainer registration and login

Secure password hashing using bcrypt

JWT-based authentication

Role-based access control (USER, TRAINER)

🧑‍🏫 Trainer Capabilities

Create, update, and delete fitness plans

View and manage their own plans

Access a dedicated Trainer Dashboard

View subscribed users (optional extension)

🧑‍💻 User Capabilities

Browse all available fitness plans

Preview plans before subscribing

Subscribe to fitness plans (simulated payment flow)

Follow and unfollow trainers

Personalized feed from followed trainers

Dedicated User Dashboard

🔒 Access Control Rules

Non-subscribed users can view only plan previews

Subscribed users get full access to plan details

Trainers cannot subscribe to their own plans

Duplicate subscriptions are prevented

🧱 Tech Stack
Backend

FastAPI – REST API framework

PostgreSQL – Relational database

SQLAlchemy – ORM

Pydantic v2 – Data validation

JWT (python-jose) – Authentication

Passlib + bcrypt – Password hashing

Pytest – Automated testing

Frontend

React.js + Vite – UI framework

Axios – API communication

Context API – Global authentication state

Role-based UI rendering

Clean, minimal, responsive design

⚙️ Backend Setup Instructions
1️⃣ Create Virtual Environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
2️⃣ Install Dependencies
pip install -r requirements.txt
3️⃣ Configure .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fitplanhub_db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
4️⃣ Run Backend
uvicorn main:app --reload
5️⃣ API Docs
http://localhost:8000/docs
⚙️ Frontend Setup Instructions
1️⃣ Install Dependencies
npm install
2️⃣ Run Frontend
npm run dev

Frontend runs on:

http://localhost:3000
🔑 Authentication Flow

User logs in and receives a JWT access token

Token is stored in localStorage

Frontend calls GET /auth/me

Application sets global authentication state

UI updates automatically based on user role

🔐 Key API Endpoints
Authentication
Method	Endpoint	Description
POST	/auth/signup	Register user or trainer
POST	/auth/login	Login and receive token
GET	/auth/me	Get current logged-in user
Plans
Method	Endpoint
GET	/plans
POST	/trainer/plans
PUT	/trainer/plans/{id}
DELETE	/trainer/plans/{id}
Subscriptions
Method	Endpoint
POST	/subscriptions/{plan_id}
Follow Trainers
Method	Endpoint
POST	/trainers/{trainer_id}/follow
🧠 Learning Outcomes

This project demonstrates:

Real-world JWT authentication

Role-based authorization

Secure password handling

Clean and scalable API design

Frontend–backend integration

Modular and maintainable project structure

📌 Future Enhancements

Real payment gateway integration

Admin dashboard

Analytics and reporting

Notifications

Mobile application (React Native)

👨‍💻 Author

Ved Koshta
B.Tech CSE | Full-Stack Developer
Focused on backend development, APIs, and scalable web systems.