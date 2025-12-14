// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Landing from "./pages/Root/Landing";
import UserSubscriptions from "./pages/User/UserSubscriptions";
import UserProgress from "./pages/User/UserProgress";
import TrainerCreatePlan from "./pages/Trainer/CreatePlan";
import PublicPlans from "./pages/Plans/PublicPlans";
import PlanDetails from "./pages/Plans/PlanDetails";
import UserOverview from "./pages/User/UserOverview";
import ProgressOverview from "./pages/Dashboard/ProgressOverview";
import UserPlans from "./pages/User/UserPlans";
import UserPlanDetails from "./pages/User/UserPlanDetails";
import TrainerOverview from "./pages/Trainer/TrainerOverview";
import TrainerPlans from "./pages/Trainer/TrainerPlans";
import Clients from "./pages/Trainer/Clients";
import Signup from "./pages/Auth/Signup";
import NotFound from "./pages/System/NotFound";
import Login from "./pages/Auth/Login";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { PublicLayout } from "./components/Layout/PublicLayout";

// new pages
import Profile from "./pages/Account/Profile";
import Notifications from "./pages/Account/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public marketing layout WITH navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/plans" element={<PublicPlans />} />
          <Route path="/plans/:id" element={<PlanDetails />} />
        </Route>

        {/* Auth pages WITHOUT navbar */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboards WITHOUT navbar, but with dashboard layout */}
        <Route element={<DashboardLayout />}>
          {/* trainer */}
          <Route path="/trainer-dashboard/plans" element={<TrainerPlans />} />
          <Route
            path="/user-dashboard/progress"
            element={<ProgressOverview />}
          />
          <Route
            path="/trainer-dashboard/progress"
            element={<ProgressOverview />}
          />

          <Route
            path="/trainer-dashboard/plans/create"
            element={<TrainerCreatePlan />}
          />
          <Route path="/trainer-dashboard/clients" element={<Clients />} />
          {/* user */}
          <Route path="/user-dashboard" element={<UserOverview />} />
          <Route path="/user-dashboard/plans" element={<UserPlans />} />
          <Route path="/trainer-dashboard" element={<TrainerOverview />} />

          <Route
            path="/user-dashboard/plans/:id"
            element={<UserPlanDetails />}
          />

          {/* shared account pages */}
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/notifications" element={<Notifications />} />
          <Route
            path="/user-dashboard/subscriptions"
            element={<UserSubscriptions />}
          />
          <Route path="/user-dashboard/progress" element={<UserProgress />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
