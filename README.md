A full-stack fitness platform connecting trainers and users with workout plans, progress tracking, and social features.
This project is based on the Fit Plan Hub concept and has been customized, tested, and deployed for learning and portfolio purposes, with additional configuration and improvements.

Features
For Users:

Browse and subscribe to fitness plans
Track daily progress including weight, calories, and workouts
Follow trainers and other users
Social feed with posts, likes, and comments
Progress analytics and statistics
Review and rate fitness plans
For Trainers:

Create and manage fitness plans
Track client subscriptions
Publish posts to community
View client progress
Manage pricing and discounts
General Features:

Secure authentication with JWT tokens
Payment integration with Razorpay
File uploads for avatars and plan images
Review and rating system
Responsive design for all devices
Tech Stack
Frontend:

React 19
React Router v7
Tailwind CSS v4
Axios for API calls
Framer Motion for animations
Lucide React for icons
Backend:

Node.js with Express
TypeScript
MongoDB with Mongoose
JWT Authentication
Cloudinary for file storage
Razorpay for payment processing
Socket.IO
Brevo email service
Prerequisites
Before you begin, make sure you have the following installed on your system:

Node.js (version 18 or higher)
npm or yarn package manager
MongoDB (local installation or MongoDB Atlas account)
Git
Installation
Step 1: Clone the repository

git clone https://github.com/Shishir2405/Fit_Plan_Hub.git
cd fitplanhub
Step 2: Install Backend Dependencies

cd fitplanhub-backend
npm install
Step 3: Install Frontend Dependencies

cd fitplanhub-frontend
npm install
Environment Configuration
Backend Environment Setup
Create a .env file in the fitplanhub-backend directory with the following configuration:

# Server
NODE_ENV=development
PORT=5001

# Frontend
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/fitplanhub_Shishir

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Cloudinary
CLOUDINARY_CLOUD_NAME=dj0wtkszr
CLOUDINARY_API_KEY=639617314887737
CLOUDINARY_API_SECRET=Q0xiluweNmK4214uFaXAUjlsv24
CLOUDINARY_FOLDER=fitplan_hub

# Razorpay
RAZORPAY_KEY_ID=rzp_test_OmphsugYRdHcUo
RAZORPAY_KEY_SECRET=jj4eD0qWZCAA8pCyhSPPVNJl
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret

# Payment
PAYMENT_SUCCESS_URL=http://localhost:3000/payment-success

# Email (Brevo)
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_NAME=FitPlanHub
BREVO_SENDER_EMAIL=noreply@fitplanhub.com

# Cron
ENABLE_CRON_JOBS=true
Important Notes:

The application will work with just MongoDB and JWT secrets configured
Cloudinary is optional - file uploads will be disabled without it
Razorpay is optional - payments will be disabled without it
Email notifications are currently disabled in the codebase
Real-time messaging is currently disabled in the codebase
Frontend Environment Setup
Create a .env file in the fitplanhub-frontend directory:

VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
Setting Up Local MongoDB
Option 1: Install MongoDB Locally

Download and install MongoDB Community Edition from https://www.mongodb.com/try/download/community

Start MongoDB service:

On macOS: brew services start mongodb-community
On Ubuntu: sudo systemctl start mongod
On Windows: MongoDB should start automatically as a service
Verify MongoDB is running:

mongosh
Option 2: Use MongoDB Atlas (Cloud)

Create a free account at https://www.mongodb.com/cloud/atlas
Create a new cluster
Get your connection string
Replace the MONGO_URI in your backend .env file with your Atlas connection string
Running the Application
Start Backend Server
Open a terminal window and run:

cd fitplanhub-backend
npm run dev
The backend server will start on http://localhost:5001

You should see output similar to:

Server running on port 5001
MongoDB connected successfully
Start Frontend Development Server
Open another terminal window and run:

cd fitplanhub-frontend
npm run dev
The frontend will start on http://localhost:5173

You should see output similar to:

VITE v7.2.4  ready in 500 ms
➜  Local:   http://localhost:5173/
Access the Application
Open your browser and navigate to http://localhost:5173

You can now:

Sign up for a new account (choose either User or Trainer role)
Log in with your credentials
Explore the platform features
Project Structure
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
API Documentation
The complete API documentation is available in the backend directory. Here are the main API endpoints:

Authentication:

POST /api/auth/signup - Register new user
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile
PUT /api/auth/profile - Update profile
Plans:

GET /api/plans - Get all plans
GET /api/plans/:id - Get plan details
POST /api/plans - Create plan (Trainer only)
PUT /api/plans/:id - Update plan (Trainer only)
DELETE /api/plans/:id - Delete plan (Trainer only)
Subscriptions:

POST /api/subscriptions - Subscribe to plan
GET /api/subscriptions/my-subscriptions - Get user subscriptions
PUT /api/subscriptions/:id/cancel - Cancel subscription
Social Features:

POST /api/posts - Create post
GET /api/posts/feed - Get feed posts
POST /api/posts/:id/like - Like/unlike post
POST /api/posts/:id/comment - Comment on post
Progress Tracking:

POST /api/progress - Log progress
GET /api/progress/my-progress - Get progress entries
GET /api/progress/stats/:planId - Get progress statistics
For complete API documentation with all endpoints and examples, refer to the API documentation file in the backend directory.
