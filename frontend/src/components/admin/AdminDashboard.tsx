import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminProfile from "./AdminProfile";
import AdminJobForm from "./AdminJobForm";
import AdminJobList from "./AdminJobList";
import AdminApplicationsList from "./AdminApplicationsList";
import AdminStats from "./AdminStats";
import AdminTabs from "./AdminTabs";
import useAuthStore from "../../store/authStore";
import useJobStore from "../../store/jobStore";
import useApplicationStore from "../../store/applicationStore";

export type AdminTab =
  | "overview"
  | "post-job"
  | "manage-jobs"
  | "applications"
  | "profile";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { user, isAdmin } = useAuthStore();
  const { fetchAdminJobs, adminJobs, isLoading: jobsLoading } = useJobStore();
  const {
    fetchAdminApplications,
    adminApplications,
    isLoading: appsLoading,
  } = useApplicationStore();

  useEffect(() => {
    if (isAdmin()) {
      fetchAdminJobs();
      fetchAdminApplications();
    }
  }, []);

  const handleEditJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveTab("post-job");
  };

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    if (tab !== "post-job") {
      setSelectedJobId(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <AdminStats
            jobs={adminJobs}
            applications={adminApplications}
            adminName={(user as any)?.adminName || "Admin"}
          />
        );

      case "post-job":
        return (
          <AdminJobForm
            jobId={selectedJobId}
            onSuccess={() => {
              setSelectedJobId(null);
              setActiveTab("manage-jobs");
            }}
            onCancel={() => {
              setSelectedJobId(null);
              setActiveTab("manage-jobs");
            }}
          />
        );

      case "manage-jobs":
        return (
          <AdminJobList
            jobs={adminJobs}
            isLoading={jobsLoading}
            onEdit={handleEditJob}
            onViewApplications={(jobId) => {
              setSelectedJobId(jobId);
              setActiveTab("applications");
            }}
          />
        );

      case "applications":
        return (
          <AdminApplicationsList
            applications={adminApplications}
            isLoading={appsLoading}
            jobId={selectedJobId}
          />
        );

      case "profile":
        return <AdminProfile user={user} />;

      default:
        return null;
    }
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">
          Unauthorized: Admin access required
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <AdminSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            adminName={(user as any)?.adminName || "Admin"}
            adminEmail={user?.email || ""}
          />

          {/* Main Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-6">
              <AdminTabs activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
