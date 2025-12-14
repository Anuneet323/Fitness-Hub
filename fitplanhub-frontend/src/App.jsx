// src/App.jsx
// Main app routing configuration for the fitness platform
// Handles public pages, auth flows, and protected dashboards for trainers/users

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Public pages (marketing/landing)
import Landing from "./pages/Root/Landing";
import PublicPlans from "./pages/Plans/PublicPlans";
import PlanDetails from "./pages/Plans/PlanDetails";
import HowToUse from "./pages/System/HowToUse";

// Auth pages
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";

// User dashboard pages
import UserOverview from "./pages/User/UserOverview";
import UserCommunity from "./pages/User/Community";
import UserPlans from "./pages/User/UserPlans";
import UserPlanDetails from "./pages/User/UserPlanDetails";
import TrainersBrowse from "./pages/User/TrainersBrowse";
import TrainerProfile from "./pages/User/TrainerProfile";
import UserProgress from "./pages/User/UserProgress";
import UserSubscriptions from "./pages/User/UserSubscriptions";

// Trainer dashboard pages
import TrainerOverview from "./pages/Trainer/TrainerOverview";
import TrainerCommunity from "./pages/Trainer/Community";
import TrainerPlans from "./pages/Trainer/TrainerPlans";
import TrainerCreatePlan from "./pages/Trainer/CreatePlan";
import CreatePost from "./pages/Trainer/CreatePost";
import Clients from "./pages/Trainer/Clients";

// Shared dashboard components
import ProgressOverview from "./pages/Dashboard/ProgressOverview";
import Profile from "./pages/Account/Profile";
import Notifications from "./pages/Account/Notifications";

// Layout components
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { PublicLayout } from "./components/Layout/PublicLayout";

// System pages
import NotFound from "./pages/System/NotFound";

function App() {
  console.log("App component rendering - setting up routes");

  return (
    <Router>
      <Routes>
        {/* Public routes - uses PublicLayout with marketing navbar */}
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="plans" element={<PublicPlans />} />
          <Route path="plans/:id" element={<PlanDetails />} />
          <Route path="how-to-use" element={<HowToUse />} />
        </Route>

        {/* Auth routes - no layout/navbar for clean signup/login experience */}
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />

        {/* Protected dashboard routes - requires auth + DashboardLayout */}
        <Route element={<DashboardLayout />}>
          {/* Trainer dashboard routes */}
          <Route path="trainer-dashboard" element={<TrainerOverview />} />
          <Route
            path="trainer-dashboard/community"
            element={<TrainerCommunity />}
          />
          <Route
            path="trainer-dashboard/community/create-post"
            element={<CreatePost />}
          />
          <Route path="trainer-dashboard/plans" element={<TrainerPlans />} />
          <Route
            path="trainer-dashboard/plans/create"
            element={<TrainerCreatePlan />}
          />
          <Route path="trainer-dashboard/clients" element={<Clients />} />
          <Route
            path="trainer-dashboard/progress"
            element={<ProgressOverview />}
          />

          {/* User dashboard routes */}
          <Route path="user-dashboard" element={<UserOverview />} />
          <Route path="user-dashboard/community" element={<UserCommunity />} />
          <Route path="user-dashboard/plans" element={<UserPlans />} />
          <Route
            path="user-dashboard/plans/:id"
            element={<UserPlanDetails />}
          />
          <Route path="user-dashboard/trainers" element={<TrainersBrowse />} />
          <Route
            path="user-dashboard/trainers/:id"
            element={<TrainerProfile />}
          />
          <Route path="user-dashboard/progress" element={<UserProgress />} />
          <Route
            path="user-dashboard/subscriptions"
            element={<UserSubscriptions />}
          />

          {/* Shared profile/notification routes - accessible from both dashboards */}
          <Route path="dashboard/profile" element={<Profile />} />
          <Route path="dashboard/notifications" element={<Notifications />} />
        </Route>

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
