# 🎯 FitPlanHub Backend API Documentation

Complete API reference with all endpoints, request/response formats, and cURL examples.

**Base URL:** `http://localhost:5001/api`

**Environment:** Development

---

## 📑 Table of Contents

1. [Authentication](#authentication)
2. [Plans](#plans)
3. [Subscriptions](#subscriptions)
4. [Follow System](#follow-system)
5. [Posts (Social Feed)](#posts-social-feed)
6. [Reviews](#reviews)
7. [Progress Tracking](#progress-tracking)
8. [Notifications](#notifications)
9. [Payments](#payments)
10. [File Uploads](#file-uploads)
11. [Messages](#messages)

---

## 🔐 Authentication

### 1. User Signup

**Endpoint:** `POST /api/auth/signup`

**Description:** Register a new user or trainer account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123def456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Description:** Login with email and password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123def456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatarUrl": "https://cloudinary.com/avatar.jpg"
  }
}
```

---

### 3. Get Profile

**Endpoint:** `GET /api/auth/profile`

**Description:** Get authenticated user's profile.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "user": {
    "id": "64abc123def456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatarUrl": "https://cloudinary.com/avatar.jpg",
    "bio": "Fitness enthusiast",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "height": 175,
    "weight": 70,
    "fitnessGoal": "Weight Loss",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. Update Profile

**Endpoint:** `PUT /api/auth/profile`

**Description:** Update user profile information.

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "John Updated",
  "bio": "Fitness enthusiast and runner",
  "height": 180,
  "weight": 75,
  "fitnessGoal": "Muscle Gain"
}
```

**cURL Example:**

```bash
curl -X PUT http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "bio": "Fitness enthusiast and runner",
    "height": 180,
    "weight": 75
  }'
```

**Response (200):**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "64abc123def456",
    "name": "John Updated",
    "bio": "Fitness enthusiast and runner",
    "height": 180,
    "weight": 75
  }
}
```

---

### 5. Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`

**Description:** Request password reset link.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

**Response (200):**

```json
{
  "message": "Password reset email sent",
  "resetUrl": "http://localhost:3000/reset-password/token123"
}
```

---

### 6. Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Description:** Reset password with token.

**Request Body:**

```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_from_email",
    "newPassword": "newpassword123"
  }'
```

**Response (200):**

```json
{
  "message": "Password reset successful"
}
```

---

## 🏋️ Plans

### 1. Get All Plans

**Endpoint:** `GET /api/plans`

**Description:** Get all active plans with filtering and pagination.

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `category` (string, optional)
- `difficultyLevel` (string, optional)
- `minPrice` (number, optional)
- `maxPrice` (number, optional)
- `search` (string, optional)
- `trainerId` (string, optional)

**cURL Example:**

```bash
curl -X GET "http://localhost:5001/api/plans?page=1&limit=10&category=weight-loss&difficultyLevel=beginner"
```

**Response (200):**

```json
{
  "plans": [
    {
      "_id": "64xyz789abc123",
      "title": "30-Day Weight Loss Challenge",
      "description": "Transform your body in 30 days",
      "category": "weight-loss",
      "difficultyLevel": "beginner",
      "price": 999,
      "discountPrice": 799,
      "duration": 30,
      "durationUnit": "days",
      "thumbnail": "https://cloudinary.com/plan1.jpg",
      "averageRating": 4.5,
      "totalReviews": 120,
      "totalSubscribers": 450,
      "trainerId": {
        "_id": "64trainer123",
        "name": "Sarah Johnson",
        "avatarUrl": "https://cloudinary.com/trainer.jpg",
        "specializations": ["Weight Loss", "Nutrition"]
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

---

### 2. Get Plan by ID

**Endpoint:** `GET /api/plans/:id`

**Description:** Get detailed information about a specific plan.

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/plans/64xyz789abc123
```

**Response (200):**

```json
{
  "plan": {
    "_id": "64xyz789abc123",
    "title": "30-Day Weight Loss Challenge",
    "description": "Transform your body in 30 days",
    "detailedDescription": "Full workout program...",
    "category": "weight-loss",
    "difficultyLevel": "beginner",
    "price": 999,
    "duration": 30,
    "durationUnit": "days",
    "thumbnail": "https://cloudinary.com/plan1.jpg",
    "images": ["https://cloudinary.com/img1.jpg"],
    "features": ["Daily workouts", "Meal plans", "Progress tracking"],
    "workoutSchedule": [
      {
        "day": 1,
        "title": "Full Body Workout",
        "exercises": [
          {
            "name": "Push-ups",
            "sets": 3,
            "reps": 15,
            "restTime": 60
          }
        ]
      }
    ],
    "nutritionPlan": {
      "calories": 1800,
      "protein": 120,
      "carbs": 200,
      "fats": 60
    },
    "trainerId": {
      "_id": "64trainer123",
      "name": "Sarah Johnson",
      "avatarUrl": "https://cloudinary.com/trainer.jpg",
      "bio": "Certified fitness coach",
      "certifications": ["ACE", "NASM"],
      "experience": 5
    },
    "averageRating": 4.5,
    "totalReviews": 120,
    "totalSubscribers": 450
  }
}
```

---

### 3. Create Plan (Trainer Only)

**Endpoint:** `POST /api/plans`

**Description:** Create a new fitness plan (trainers only).

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "title": "Advanced Muscle Building",
  "description": "Build muscle mass with proven techniques",
  "detailedDescription": "Comprehensive 12-week program...",
  "category": "muscle-gain",
  "difficultyLevel": "advanced",
  "price": 1499,
  "duration": 12,
  "durationUnit": "weeks",
  "thumbnail": "https://cloudinary.com/thumbnail.jpg",
  "features": ["Custom workout plans", "Video demonstrations"]
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/plans \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Muscle Building",
    "description": "Build muscle mass",
    "category": "muscle-gain",
    "difficultyLevel": "advanced",
    "price": 1499,
    "duration": 12,
    "durationUnit": "weeks"
  }'
```

**Response (201):**

```json
{
  "message": "Plan created successfully",
  "plan": {
    "_id": "64newplan789",
    "title": "Advanced Muscle Building",
    "trainerId": "64trainer123",
    "createdAt": "2024-12-14T00:00:00.000Z"
  }
}
```

---

### 4. Update Plan (Trainer Only)

**Endpoint:** `PUT /api/plans/:id`

**Description:** Update an existing plan.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X PUT http://localhost:5001/api/plans/64xyz789abc123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1299,
    "discountPrice": 999
  }'
```

**Response (200):**

```json
{
  "message": "Plan updated successfully",
  "plan": {
    "_id": "64xyz789abc123",
    "price": 1299,
    "discountPrice": 999
  }
}
```

---

### 5. Delete Plan (Trainer Only)

**Endpoint:** `DELETE /api/plans/:id`

**Description:** Delete a plan.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X DELETE http://localhost:5001/api/plans/64xyz789abc123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "message": "Plan deleted successfully"
}
```

---

### 6. Get My Plans (Trainer Only)

**Endpoint:** `GET /api/plans/my-plans`

**Description:** Get all plans created by the authenticated trainer.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/plans/my-plans \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "plans": [
    {
      "_id": "64plan1",
      "title": "Weight Loss Program",
      "totalSubscribers": 150,
      "averageRating": 4.5
    }
  ]
}
```

---

## 💳 Subscriptions

### 1. Create Subscription

**Endpoint:** `POST /api/subscriptions`

**Description:** Subscribe to a plan after successful payment.

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "planId": "64xyz789abc123",
  "paymentId": "pay_razorpay123",
  "orderId": "order_razorpay456",
  "amount": 999
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/subscriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "64xyz789abc123",
    "paymentId": "pay_razorpay123",
    "orderId": "order_razorpay456",
    "amount": 999
  }'
```

**Response (201):**

```json
{
  "message": "Subscription created successfully",
  "subscription": {
    "_id": "64sub123",
    "userId": "64user456",
    "planId": "64xyz789abc123",
    "status": "active",
    "startDate": "2024-12-14T00:00:00.000Z",
    "endDate": "2025-01-13T00:00:00.000Z"
  }
}
```

---

### 2. Get My Subscriptions

**Endpoint:** `GET /api/subscriptions/my-subscriptions`

**Description:** Get all subscriptions for the authenticated user.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/subscriptions/my-subscriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "subscriptions": [
    {
      "_id": "64sub123",
      "planId": {
        "title": "Weight Loss Challenge",
        "thumbnail": "https://cloudinary.com/thumb.jpg"
      },
      "trainerId": {
        "name": "Sarah Johnson",
        "avatarUrl": "https://cloudinary.com/avatar.jpg"
      },
      "status": "active",
      "startDate": "2024-12-14T00:00:00.000Z",
      "endDate": "2025-01-13T00:00:00.000Z",
      "amount": 999
    }
  ]
}
```

---

### 3. Get Subscription by ID

**Endpoint:** `GET /api/subscriptions/:id`

**Description:** Get detailed subscription information.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/subscriptions/64sub123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 4. Cancel Subscription

**Endpoint:** `PUT /api/subscriptions/:id/cancel`

**Description:** Cancel an active subscription.

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "reason": "Found a better plan"
}
```

**cURL Example:**

```bash
curl -X PUT http://localhost:5001/api/subscriptions/64sub123/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Found a better plan"
  }'
```

**Response (200):**

```json
{
  "message": "Subscription cancelled successfully",
  "subscription": {
    "status": "cancelled",
    "cancelledAt": "2024-12-14T00:00:00.000Z"
  }
}
```

---

### 5. Get Trainer Subscriptions (Trainer Only)

**Endpoint:** `GET /api/subscriptions/trainer-subscriptions`

**Description:** Get all subscriptions for trainer's plans.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/subscriptions/trainer-subscriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 👥 Follow System

### 1. Follow User

**Endpoint:** `POST /api/follow/:userId/follow`

**Description:** Follow a user or trainer.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/follow/64trainer123/follow \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (201):**

```json
{
  "message": "Successfully followed user",
  "follow": {
    "_id": "64follow123",
    "followerId": "64user456",
    "followingId": "64trainer123"
  }
}
```

---

### 2. Unfollow User

**Endpoint:** `DELETE /api/follow/:userId/unfollow`

**Description:** Unfollow a user.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X DELETE http://localhost:5001/api/follow/64trainer123/unfollow \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "message": "Successfully unfollowed user"
}
```

---

### 3. Get Followers

**Endpoint:** `GET /api/follow/:userId/followers`

**Description:** Get list of followers for a user.

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/follow/64trainer123/followers
```

**Response (200):**

```json
{
  "followers": [
    {
      "_id": "64user1",
      "name": "John Doe",
      "avatarUrl": "https://cloudinary.com/avatar.jpg",
      "bio": "Fitness enthusiast"
    }
  ],
  "count": 1
}
```

---

### 4. Get Following

**Endpoint:** `GET /api/follow/:userId/following`

**Description:** Get list of users being followed.

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/follow/64user456/following
```

---

## 📱 Posts (Social Feed)

### 1. Create Post

**Endpoint:** `POST /api/posts`

**Description:** Create a new social post.

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "content": "Just finished my morning workout! 💪",
  "mediaUrls": ["https://cloudinary.com/workout.jpg"],
  "mediaType": "image",
  "hashtags": ["fitness", "workout", "motivation"]
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Just finished my morning workout! 💪",
    "hashtags": ["fitness", "workout"]
  }'
```

**Response (201):**

```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "64post123",
    "content": "Just finished my morning workout! 💪",
    "authorId": {
      "name": "John Doe",
      "avatarUrl": "https://cloudinary.com/avatar.jpg"
    },
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2024-12-14T00:00:00.000Z"
  }
}
```

---

### 2. Get Feed Posts

**Endpoint:** `GET /api/posts/feed`

**Description:** Get personalized feed (posts from followed users).

**Headers:**

- `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)

**cURL Example:**

```bash
curl -X GET "http://localhost:5001/api/posts/feed?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "posts": [
    {
      "_id": "64post123",
      "content": "Great workout today!",
      "authorId": {
        "name": "Trainer Sarah",
        "avatarUrl": "https://cloudinary.com/avatar.jpg",
        "role": "trainer"
      },
      "mediaUrls": ["https://cloudinary.com/post.jpg"],
      "likesCount": 45,
      "commentsCount": 12,
      "createdAt": "2024-12-14T00:00:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

---

### 3. Get User Posts

**Endpoint:** `GET /api/posts/user/:userId`

**Description:** Get all posts by a specific user.

**Query Parameters:**

- `page`, `limit`

**cURL Example:**

```bash
curl -X GET "http://localhost:5001/api/posts/user/64user456?page=1&limit=10"
```

---

### 4. Like/Unlike Post

**Endpoint:** `POST /api/posts/:id/like`

**Description:** Toggle like on a post.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/posts/64post123/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "message": "Post liked",
  "likesCount": 46,
  "isLiked": true
}
```

---

### 5. Comment on Post

**Endpoint:** `POST /api/posts/:id/comment`

**Description:** Add a comment to a post.

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "text": "Great post! Keep it up!"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/posts/64post123/comment \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Great post! Keep it up!"
  }'
```

**Response (201):**

```json
{
  "message": "Comment added",
  "post": {
    "commentsCount": 13,
    "comments": [...]
  }
}
```

---

### 6. Delete Post

**Endpoint:** `DELETE /api/posts/:id`

**Description:** Delete your own post.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X DELETE http://localhost:5001/api/posts/64post123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ⭐ Reviews

### 1. Create Review

**Endpoint:** `POST /api/reviews`

**Description:** Write a review for a subscribed plan.

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "planId": "64plan123",
  "rating": 5,
  "title": "Excellent program!",
  "comment": "This plan helped me lose 10kg in 30 days!",
  "images": ["https://cloudinary.com/before-after.jpg"]
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/reviews \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "64plan123",
    "rating": 5,
    "title": "Excellent program!",
    "comment": "This plan helped me lose 10kg!"
  }'
```

**Response (201):**

```json
{
  "message": "Review submitted successfully",
  "review": {
    "_id": "64review123",
    "rating": 5,
    "title": "Excellent program!",
    "isVerifiedPurchase": true
  }
}
```

---

### 2. Get Plan Reviews

**Endpoint:** `GET /api/reviews/plan/:planId`

**Description:** Get all reviews for a plan.

**Query Parameters:**

- `page`, `limit`
- `sort` (recent, helpful, rating-high, rating-low)

**cURL Example:**

```bash
curl -X GET "http://localhost:5001/api/reviews/plan/64plan123?page=1&limit=10&sort=helpful"
```

**Response (200):**

```json
{
  "reviews": [
    {
      "_id": "64review123",
      "userId": {
        "name": "John Doe",
        "avatarUrl": "https://cloudinary.com/avatar.jpg"
      },
      "rating": 5,
      "title": "Excellent program!",
      "comment": "This plan helped me...",
      "helpfulCount": 25,
      "isVerifiedPurchase": true,
      "createdAt": "2024-12-01T00:00:00.000Z"
    }
  ],
  "totalPages": 3,
  "total": 25
}
```

---

### 3. Mark Review as Helpful

**Endpoint:** `POST /api/reviews/:id/helpful`

**Description:** Mark a review as helpful.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/reviews/64review123/helpful \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📊 Progress Tracking

### 1. Log Progress

**Endpoint:** `POST /api/progress`

**Description:** Log daily fitness progress.

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "planId": "64plan123",
  "date": "2024-12-14",
  "weight": 72,
  "calories": 1800,
  "protein": 120,
  "workoutsDone": 1,
  "workoutDuration": 45,
  "steps": 8000,
  "water": 2.5,
  "sleep": 7.5,
  "mood": "good",
  "notes": "Felt strong today!"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/progress \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "64plan123",
    "date": "2024-12-14",
    "weight": 72,
    "calories": 1800,
    "workoutsDone": 1
  }'
```

**Response (201):**

```json
{
  "message": "Progress logged successfully",
  "progress": {
    "_id": "64progress123",
    "date": "2024-12-14",
    "weight": 72
  }
}
```

---

### 2. Get My Progress

**Endpoint:** `GET /api/progress/my-progress`

**Description:** Get progress entries with optional filtering.

**Headers:**

- `Authorization: Bearer <token>`

**Query Parameters:**

- `planId` (optional)
- `startDate` (optional)
- `endDate` (optional)

**cURL Example:**

```bash
curl -X GET "http://localhost:5001/api/progress/my-progress?planId=64plan123&startDate=2024-12-01&endDate=2024-12-14" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Get Progress Stats

**Endpoint:** `GET /api/progress/stats/:planId`

**Description:** Get aggregated progress statistics.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/progress/stats/64plan123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "stats": {
    "totalEntries": 30,
    "weightChange": -5,
    "avgCalories": 1850,
    "totalWorkouts": 28,
    "avgWorkoutDuration": 42
  },
  "progress": [...]
}
```

---

## 🔔 Notifications

### 1. Get My Notifications

**Endpoint:** `GET /api/notifications`

**Description:** Get all notifications for authenticated user.

**Headers:**

- `Authorization: Bearer <token>`

**Query Parameters:**

- `page`, `limit`
- `isRead` (true/false, optional)

**cURL Example:**

```bash
curl -X GET "http://localhost:5001/api/notifications?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "notifications": [
    {
      "_id": "64notif123",
      "type": "follow",
      "title": "New Follower",
      "message": "Someone started following you",
      "fromUserId": {
        "name": "Jane Smith",
        "avatarUrl": "https://cloudinary.com/avatar.jpg"
      },
      "link": "/profile/64user789",
      "isRead": false,
      "createdAt": "2024-12-14T00:00:00.000Z"
    }
  ],
  "unreadCount": 5,
  "totalPages": 2,
  "total": 25
}
```

---

### 2. Get Unread Count

**Endpoint:** `GET /api/notifications/unread-count`

**Description:** Get count of unread notifications.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/notifications/unread-count \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "unreadCount": 5
}
```

---

### 3. Get Notifications by Type

**Endpoint:** `GET /api/notifications/type/:type`

**Description:** Filter notifications by type.

**Valid Types:** `follow`, `like`, `comment`, `subscription`, `review`, `message`, `reminder`, `system`

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X GET "http://localhost:5001/api/notifications/type/follow?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 4. Mark as Read

**Endpoint:** `PUT /api/notifications/:id/read`

**Description:** Mark a notification as read.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X PUT http://localhost:5001/api/notifications/64notif123/read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "message": "Notification marked as read",
  "notification": {
    "_id": "64notif123",
    "isRead": true
  }
}
```

---

### 5. Mark All as Read

**Endpoint:** `PUT /api/notifications/mark-all-read`

**Description:** Mark all notifications as read.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X PUT http://localhost:5001/api/notifications/mark-all-read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "message": "All notifications marked as read",
  "modifiedCount": 5
}
```

---

### 6. Delete Notification

**Endpoint:** `DELETE /api/notifications/:id`

**Description:** Delete a specific notification.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X DELETE http://localhost:5001/api/notifications/64notif123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "message": "Notification deleted successfully"
}
```

---

### 7. Delete All Read Notifications

**Endpoint:** `DELETE /api/notifications/read/all`

**Description:** Delete all read notifications.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X DELETE http://localhost:5001/api/notifications/read/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "message": "All read notifications deleted",
  "deletedCount": 10
}
```

---

### 8. Bulk Delete Notifications

**Endpoint:** `POST /api/notifications/bulk-delete`

**Description:** Delete multiple notifications by IDs.

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "notificationIds": ["64notif1", "64notif2", "64notif3"]
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/notifications/bulk-delete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notificationIds": ["64notif1", "64notif2", "64notif3"]
  }'
```

**Response (200):**

```json
{
  "message": "Notifications deleted successfully",
  "deletedCount": 3
}
```

---

## 💰 Payments

_Note: Payment endpoints require Razorpay configuration_

### 1. Create Order

**Endpoint:** `POST /api/payments/create-order`

**Description:** Create a Razorpay order for payment.

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "planId": "64plan123",
  "amount": 999,
  "currency": "INR"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/payments/create-order \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "64plan123",
    "amount": 999,
    "currency": "INR"
  }'
```

**Response (201):**

```json
{
  "order": {
    "orderId": "order_MZx9y8z9A8B9C",
    "amount": 99900,
    "currency": "INR",
    "receipt": "rcpt_1234567890"
  },
  "payment": {
    "_id": "64payment123",
    "status": "created"
  }
}
```

---

### 2. Verify Payment

**Endpoint:** `POST /api/payments/verify`

**Description:** Verify payment signature after successful payment.

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "razorpay_order_id": "order_MZx9y8z9A8B9C",
  "razorpay_payment_id": "pay_MZx9y8z9A8B9D",
  "razorpay_signature": "signature_hash_here"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/payments/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_MZx9y8z9A8B9C",
    "razorpay_payment_id": "pay_MZx9y8z9A8B9D",
    "razorpay_signature": "signature_hash"
  }'
```

**Response (200):**

```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

---

## 📁 File Uploads

_Note: File upload endpoints require Cloudinary configuration_

### 1. Upload Avatar

**Endpoint:** `POST /api/uploads/avatar`

**Description:** Upload user avatar image.

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**

- `file`: Image file (max 10MB)

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/uploads/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/avatar.jpg"
```

**Response (200):**

```json
{
  "message": "Avatar uploaded successfully",
  "url": "https://res.cloudinary.com/fitplanhub/image/upload/v1234567890/avatars/user123.jpg",
  "publicId": "avatars/user123"
}
```

---

### 2. Upload Cover Image

**Endpoint:** `POST /api/uploads/cover`

**Description:** Upload profile cover image.

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**

- `file`: Image file

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/uploads/cover \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/cover.jpg"
```

---

### 3. Upload Plan Media

**Endpoint:** `POST /api/uploads/plan-media`

**Description:** Upload plan thumbnail or images.

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**

- `file`: Image file
- `type`: "thumbnail" or "image"

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/uploads/plan-media \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/plan.jpg" \
  -F "type=thumbnail"
```

---

### 4. Upload Post Media

**Endpoint:** `POST /api/uploads/post-media`

**Description:** Upload images or videos for posts.

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**

- `file`: Image or video file

**cURL Example:**

```bash
curl -X POST http://localhost:5001/api/uploads/post-media \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/post-image.jpg"
```

---

### 5. Delete File

**Endpoint:** `DELETE /api/uploads/:publicId`

**Description:** Delete a file from Cloudinary.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X DELETE http://localhost:5001/api/uploads/avatars/user123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "message": "File deleted successfully"
}
```

---

## 💬 Messages (Real-time Chat)

_Note: Messages use Socket.IO for real-time communication_

### WebSocket Connection

**Connect to Socket.IO:**

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:5001", {
  auth: {
    token: "YOUR_JWT_TOKEN",
  },
});

// Listen for connection
socket.on("connect", () => {
  console.log("Connected to chat server");
});
```

---

### Socket Events

#### 1. Send Message

**Event:** `send-message`

**Emit:**

```javascript
socket.emit("send-message", {
  receiverId: "64user789",
  content: "Hello! How are you?",
  mediaUrl: "https://cloudinary.com/image.jpg", // optional
  mediaType: "image", // optional: 'image', 'video', 'file'
});
```

**Listen for confirmation:**

```javascript
socket.on("message-sent", (message) => {
  console.log("Message sent:", message);
});
```

---

#### 2. Receive Message

**Event:** `receive-message`

**Listen:**

```javascript
socket.on("receive-message", (message) => {
  console.log("New message:", message);
  // message structure:
  // {
  //   _id: '64msg123',
  //   senderId: { name: 'John', avatarUrl: '...' },
  //   receiverId: '64user789',
  //   content: 'Hello!',
  //   createdAt: '2024-12-14T00:00:00.000Z'
  // }
});
```

---

#### 3. Typing Indicator

**Start typing:**

```javascript
socket.emit("typing", {
  receiverId: "64user789",
});
```

**Stop typing:**

```javascript
socket.emit("stop-typing", {
  receiverId: "64user789",
});
```

**Listen for typing:**

```javascript
socket.on("user-typing", (data) => {
  console.log(`User ${data.userId} is typing: ${data.isTyping}`);
});
```

---

#### 4. Mark as Read

**Emit:**

```javascript
socket.emit("mark-as-read", {
  messageId: "64msg123",
});
```

**Listen for confirmation:**

```javascript
socket.on("message-read", (data) => {
  console.log("Message marked as read:", data.messageId);
});
```

---

#### 5. Online/Offline Status

**Listen for user online:**

```javascript
socket.on("user-online", (data) => {
  console.log("User came online:", data.userId);
});
```

**Listen for user offline:**

```javascript
socket.on("user-offline", (data) => {
  console.log("User went offline:", data.userId);
});
```

---

### REST API Endpoints for Messages

#### 1. Get Conversation

**Endpoint:** `GET /api/messages/conversation/:userId`

**Description:** Get message history with a user.

**Headers:**

- `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 50)

**cURL Example:**

```bash
curl -X GET "http://localhost:5001/api/messages/conversation/64user789?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "messages": [
    {
      "_id": "64msg123",
      "senderId": {
        "name": "John Doe",
        "avatarUrl": "https://cloudinary.com/avatar.jpg"
      },
      "receiverId": "64user789",
      "content": "Hello!",
      "isRead": true,
      "createdAt": "2024-12-14T00:00:00.000Z"
    }
  ],
  "totalPages": 2,
  "currentPage": 1
}
```

---

#### 2. Get All Conversations

**Endpoint:** `GET /api/messages/conversations`

**Description:** Get list of all conversations.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X GET http://localhost:5001/api/messages/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "conversations": [
    {
      "userId": "64user789",
      "user": {
        "name": "Jane Smith",
        "avatarUrl": "https://cloudinary.com/avatar.jpg"
      },
      "lastMessage": {
        "content": "See you tomorrow!",
        "createdAt": "2024-12-14T00:00:00.000Z"
      },
      "unreadCount": 2
    }
  ]
}
```

---

#### 3. Delete Message

**Endpoint:** `DELETE /api/messages/:messageId`

**Description:** Delete a message.

**Headers:**

- `Authorization: Bearer <token>`

**cURL Example:**

```bash
curl -X DELETE http://localhost:5001/api/messages/64msg123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📊 Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "message": "Access denied. Trainers only."
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 429 Too Many Requests

```json
{
  "message": "Too many requests, please try again later"
}
```

### 500 Internal Server Error

```json
{
  "message": "Server error",
  "error": "Error details..."
}
```

---

## 🔒 Authentication

Most endpoints require authentication via JWT token.

**Include token in header:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Token expires in:** 7 days

**Refresh token expires in:** 30 days

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Pagination starts at page 1
3. Maximum file upload size: 10MB
4. Rate limiting: 100 requests per 15 minutes
5. Auth endpoints limited to 5 requests per 15 minutes

---

## 🚀 Quick Start Testing

### Test signup and get token:

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Use the token for authenticated requests:

```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📞 Support

For API issues or questions:

- Email: support@fitplanhub.com
- Documentation: http://localhost:5001/api/docs
- Health Check: http://localhost:5001/api/health

---

_Last Updated: December 14, 2024_
_API Version: 1.0.0_
