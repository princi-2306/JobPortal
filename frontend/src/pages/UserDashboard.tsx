// pages/UserDashboard.tsx
import React, { useEffect, useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import useAuthStore from "../store/authStore";
import useApplicationStore from "../store/applicationStore";
import useJobStore from "../store/jobStore";

const UserDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { userApplications, fetchUserApplications, isLoading } =
    useApplicationStore();
  const { fetchAllJobs } = useJobStore();

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUserApplications();
    fetchAllJobs();
  }, []);

  // Filter applications based on status and search
  const filteredApplications = userApplications.filter((app) => {
    const matchesStatus =
      selectedStatus === "all" || app.status === selectedStatus;
    const matchesSearch =
      searchTerm === "" ||
      (typeof app.job !== "string" &&
        (app.job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.job.companyName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())));
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: userApplications.length,
    applied: userApplications.filter((a) => a.status === "applied").length,
    shortlisted: userApplications.filter((a) => a.status === "shortlisted")
      .length,
    rejected: userApplications.filter((a) => a.status === "rejected").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case "shortlisted":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-600";
      case "shortlisted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {(user as any)?.name || (user as any)?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Track your job applications and manage your job search journey
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BriefcaseIcon className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.total}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Applications</h3>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.applied}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Applied</h3>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.shortlisted}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Shortlisted</h3>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.rejected}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">Rejected</h3>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                My Applications
              </h2>
              <div className="flex space-x-2">
                {["all", "applied", "shortlisted", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === status
                        ? status === "all"
                          ? "bg-gray-900 text-white"
                          : status === "applied"
                            ? "bg-blue-600 text-white"
                            : status === "shortlisted"
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all"
                      ? "All"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredApplications.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="space-y-4"
          >
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                getStatusIcon={getStatusIcon}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-xl shadow-lg"
          >
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedStatus !== "all"
                ? "Try adjusting your filters"
                : "You haven't applied to any jobs yet"}
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              Browse Jobs
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Application Card Component
interface ApplicationCardProps {
  application: any;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusBadge: (status: string) => JSX.Element;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  getStatusIcon,
  getStatusBadge,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const job = typeof application.job !== "string" ? application.job : null;

  if (!job) return null;

  const appliedDate = new Date(application.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {job.companyName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {job.jobTitle}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center">
                  <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                  {job.companyName}
                </span>
                <span className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {job.jobPlace}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(application.status)}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <EyeIcon
                className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CurrencyDollarIcon className="h-4 w-4" />
            <span>${job.salary.toLocaleString()}/year</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <span>Applied {appliedDate}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span className="capitalize">{job.jobLevel}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {getStatusIcon(application.status)}
            <span>Status: {application.status}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.requiredSkills.slice(0, 5).map((skill: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 5 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
              +{job.requiredSkills.length - 5}
            </span>
          )}
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Timeline */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Application Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Application Submitted
                        </p>
                        <p className="text-xs text-gray-500">{appliedDate}</p>
                      </div>
                    </div>
                    {application.status === "shortlisted" && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Shortlisted
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              application.updatedAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {application.status === "rejected" && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 mt-2 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Application Rejected
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              application.updatedAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Application Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Application Details
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Resume:</span>{" "}
                      <a
                        href={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Application ID:</span>{" "}
                      {application._id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Last Updated:</span>{" "}
                      {new Date(application.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Description Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Job Description
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {job.jobDescription}
                </p>
                <Link
                  to={`/jobs/${job._id}`}
                  className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Full Job Details →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
          <Link
            to={`/jobs/${job._id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Job Details
          </Link>
          {application.status === "shortlisted" && (
            <span className="text-sm text-green-600 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Congratulations! You've been shortlisted
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
