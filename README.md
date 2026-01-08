🏋️‍♂️ Fitness Hub — Full Stack Fitness Platform

A full-stack fitness platform connecting trainers and users with workout plans, progress tracking, and social features.
This repository is customized, configured, and maintained for learning, full-stack practice, and portfolio demonstration.

✅ Includes authentication, subscriptions, progress tracking, and community features using modern web technologies.

✨ Features
👤 For Users

Browse and subscribe to fitness plans

Track daily progress (weight, calories, workouts)

Follow trainers and other users

Social feed with posts, likes, and comments

Progress analytics and statistics

Review and rate fitness plans

🧑‍🏫 For Trainers

Create and manage fitness plans

Track client subscriptions

Publish posts to community

View client progress

Manage pricing and discounts

⚙️ General

Secure authentication using JWT

Payment integration with Razorpay

File uploads for avatars and plan images (Cloudinary)

Review and rating system

Responsive UI for all devices

🧱 Tech Stack
🌐 Frontend

React 19

React Router v7

Tailwind CSS v4

Axios

Framer Motion

Lucide React Icons

🔧 Backend

Node.js + Express

TypeScript

MongoDB + Mongoose

JWT Authentication

Cloudinary (file storage)

Razorpay (payments)

Socket.IO (optional / disabled)

Brevo (email service – optional)

📦 Prerequisites

Make sure these are installed:

Node.js (v18+)

npm or yarn

MongoDB (local or Atlas)

Git

🚀 Installation & Setup
✅ Step 1: Clone Repository
git clone https://github.com/Anuneet323/Fitness-Hub.git
cd Fitness-Hub

✅ Step 2: Backend Setup
cd fitplanhub-backend
npm install


Create .env file in fitplanhub-backend:

# Server
NODE_ENV=development
PORT=5001

# Frontend
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/fitplanhub_anuneet

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLOUDINARY_FOLDER=fitplan_hub

# Razorpay (optional)
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Payment
PAYMENT_SUCCESS_URL=http://localhost:3000/payment-success

# Email (optional)
BREVO_API_KEY=your_api_key
BREVO_SENDER_NAME=FitnessHub
BREVO_SENDER_EMAIL=noreply@fitnesshub.com

# Cron
ENABLE_CRON_JOBS=true


Start backend:

npm run dev


Backend runs on:
👉 http://localhost:5001

✅ Step 3: Frontend Setup
cd ../fitplanhub-frontend
npm install


Create .env in fitplanhub-frontend:

VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001


Start frontend:

npm run dev


Frontend runs on:
👉 http://localhost:5173

🗂 Project Structure
Fitness-Hub/
├── fitplanhub-backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.ts
│   └── package.json
│
├── fitplanhub-frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md

🔗 Main API Endpoints
🔐 Authentication

POST /api/auth/signup

POST /api/auth/login

GET /api/auth/profile

PUT /api/auth/profile

🏋️ Plans

GET /api/plans

GET /api/plans/:id

POST /api/plans (Trainer)

PUT /api/plans/:id

DELETE /api/plans/:id

📦 Subscriptions

POST /api/subscriptions

GET /api/subscriptions/my-subscriptions

PUT /api/subscriptions/:id/cancel

🧑‍🤝‍🧑 Social

POST /api/posts

GET /api/posts/feed

POST /api/posts/:id/like

POST /api/posts/:id/comment

📈 Progress

POST /api/progress

GET /api/progress/my-progress

GET /api/progress/stats/:planId

🎯 Learning Outcomes

This project helped in learning:

Full-stack architecture with React + Node

REST API design with authentication

MongoDB schema modeling

Environment configuration

Payment gateway integration basics

File uploads using cloud services

Debugging production-level setups
