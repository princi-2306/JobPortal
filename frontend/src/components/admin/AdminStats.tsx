import React from "react";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import type { Job } from "../../store/jobStore";
import type { PopulatedApplication } from "../../store/applicationStore";

interface AdminStatsProps {
  jobs: Job[];
  applications: PopulatedApplication[];
  adminName: string;
}

const AdminStats: React.FC<AdminStatsProps> = ({
  jobs,
  applications,
  adminName,
}) => {
  // Calculate statistics
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(
    (job) =>
      new Date(job.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  ).length;
  const totalApplications = applications.length;

  const applicationsByStatus = {
    applied: applications.filter((app) => app.status === "applied").length,
    shortlisted: applications.filter((app) => app.status === "shortlisted")
      .length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  const recentApplications = applications.slice(0, 5);

  const stats = [
    {
      title: "Total Jobs",
      value: totalJobs,
      icon: BriefcaseIcon,
      color: "bg-blue-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Active Jobs",
      value: activeJobs,
      icon: ClockIcon,
      color: "bg-green-500",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Total Applications",
      value: totalApplications,
      icon: DocumentTextIcon,
      color: "bg-purple-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Shortlisted",
      value: applicationsByStatus.shortlisted,
      icon: CheckCircleIcon,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {adminName}! 👋
        </h2>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your job postings today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
              </div>
              <h3 className="text-gray-600 font-medium">{stat.title}</h3>
            </motion.div>
          );
        })}
      </div>

      {/* Application Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Application Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Applied</span>
                <span className="font-semibold text-gray-900">
                  {applicationsByStatus.applied}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(applicationsByStatus.applied / totalApplications) * 100 || 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Shortlisted</span>
                <span className="font-semibold text-gray-900">
                  {applicationsByStatus.shortlisted}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${(applicationsByStatus.shortlisted / totalApplications) * 100 || 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Rejected</span>
                <span className="font-semibold text-gray-900">
                  {applicationsByStatus.rejected}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${(applicationsByStatus.rejected / totalApplications) * 100 || 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Applications
          </h3>
          <div className="space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app._id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {app.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {app.user.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {typeof app.job !== "string" ? app.job.jobTitle : "Job"}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      app.status === "applied"
                        ? "bg-blue-100 text-blue-600"
                        : app.status === "shortlisted"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent applications</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminStats;
