import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import type { PopulatedApplication } from "../../store/applicationStore";

interface AdminApplicationCardProps {
  application: PopulatedApplication;
  onStatusChange: (
    applicationId: string,
    status: "applied" | "shortlisted" | "rejected",
  ) => void;
}

const AdminApplicationCard: React.FC<AdminApplicationCardProps> = ({
  application,
  onStatusChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const appliedDate = new Date(application.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "shortlisted":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "rejected":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleStatusChange = async (
    newStatus: "applied" | "shortlisted" | "rejected",
  ) => {
    setIsUpdating(true);
    await onStatusChange(application._id, newStatus);
    setIsUpdating(false);
  };

  return (
    <motion.div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {application.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {application.user.username}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <EnvelopeIcon className="h-4 w-4" />
                <span>{application.user.email}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-3">
            <span
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}
            >
              {getStatusIcon(application.status)}
              <span className="capitalize">{application.status}</span>
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Job Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-1">Applied for</p>
          <p className="font-semibold text-gray-900">
            {typeof application.job !== "string"
              ? application.job.jobTitle
              : "Job"}
          </p>
          <p className="text-sm text-gray-600">
            {typeof application.job !== "string"
              ? application.job.companyName
              : ""}{" "}
            • {appliedDate}
          </p>
        </div>

        {/* Quick Actions - Always visible */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatusChange("shortlisted")}
            disabled={isUpdating || application.status === "shortlisted"}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
          >
            <CheckCircleIcon className="h-4 w-4" />
            <span>Shortlist</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatusChange("rejected")}
            disabled={isUpdating || application.status === "rejected"}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
          >
            <XCircleIcon className="h-4 w-4" />
            <span>Reject</span>
          </motion.button>
          <a
            href={application.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <DocumentTextIcon className="h-4 w-4" />
            <span>View Resume</span>
          </a>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <UserCircleIcon className="h-4 w-4" />
                    <span>{application.user.username}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>{application.user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Applied on {appliedDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Application Timeline
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
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
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {application.status === "rejected" && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 mt-2 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Rejected
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details */}
            {typeof application.job !== "string" && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Job Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Position</p>
                    <p className="text-sm font-medium text-gray-900">
                      {application.job.jobTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Company</p>
                    <p className="text-sm font-medium text-gray-900">
                      {application.job.companyName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm font-medium text-gray-900">
                      {application.job.jobPlace}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Salary</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${application.job.salary.toLocaleString()}/year
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminApplicationCard;
