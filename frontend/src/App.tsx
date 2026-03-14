// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import JobDetails from "./pages/JobDetails";
import Jobs from "./pages/Jobs";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
// import Profile from "./pages/Profile";
// import Applications from "./pages/Applications";
// import AdminJobs from "./pages/AdminJobs";
// import PostJob from "./pages/PostJob";
// import EditJob from "./pages/EditJob";
// import CompanySettings from "./pages/CompanySettings";
// import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <React.Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <Routes>
            {/* Public Routes - accessible to everyone */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes - Any Authenticated User (both user and admin) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <Applications />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            /> */}

            {/* Admin Only Routes - accessible only to users with admin role */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminJobs />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/admin/jobs/post"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <EditJob />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/admin/applications"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Applications />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/admin/applications/:jobId"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CompanySettings />
                </ProtectedRoute>
              }
            /> */}

            {/* Catch all - 404 redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default App;
