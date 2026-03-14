import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import AdminApplicationCard from "./AdminApplicationCard";
import type { PopulatedApplication } from "../../store/applicationStore";
import useApplicationStore from "../../store/applicationStore";

interface AdminApplicationsListProps {
  applications: PopulatedApplication[];
  isLoading: boolean;
  jobId?: string | null;
}

const AdminApplicationsList: React.FC<AdminApplicationsListProps> = ({
  applications,
  isLoading,
  jobId,
}) => {
  const { updateApplicationStatus } = useApplicationStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Filter applications by job if jobId is provided
  const filteredByJob = jobId
    ? applications.filter(
        (app) => typeof app.job !== "string" && app.job._id === jobId,
      )
    : applications;

  // Apply search and status filters
  const filteredApplications = filteredByJob
    .filter((app) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          app.user.username.toLowerCase().includes(search) ||
          app.user.email.toLowerCase().includes(search) ||
          (typeof app.job !== "string" &&
            app.job.jobTitle.toLowerCase().includes(search))
        );
      }
      return true;
    })
    .filter((app) => {
      // Status filter
      if (statusFilter !== "all") {
        return app.status === statusFilter;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

  const handleStatusChange = async (
    applicationId: string,
    newStatus: "applied" | "shortlisted" | "rejected",
  ) => {
    await updateApplicationStatus(applicationId, newStatus);
  };

  const exportToCSV = () => {
    const headers = [
      "Applicant Name",
      "Email",
      "Job Title",
      "Applied Date",
      "Status",
      "Resume",
    ];
    const csvData = filteredApplications.map((app) => [
      app.user.username,
      app.user.email,
      typeof app.job !== "string" ? app.job.jobTitle : "N/A",
      new Date(app.createdAt).toLocaleDateString(),
      app.status,
      app.resume,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applications-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const stats = {
    total: filteredByJob.length,
    applied: filteredByJob.filter((a) => a.status === "applied").length,
    shortlisted: filteredByJob.filter((a) => a.status === "shortlisted").length,
    rejected: filteredByJob.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {jobId ? "Job Applications" : "All Applications"}
          </h2>
          {jobId &&
            filteredByJob.length > 0 &&
            typeof filteredByJob[0].job !== "string" && (
              <p className="text-gray-600 mt-1">
                {filteredByJob[0].job.jobTitle} at{" "}
                {filteredByJob[0].job.companyName}
              </p>
            )}
        </div>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <DocumentArrowDownIcon className="h-4 w-4" />
          <span>Export CSV</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Applied</p>
          <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Shortlisted</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.shortlisted}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <ChevronDownIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredApplications.length > 0 ? (
        <AnimatePresence>
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <AdminApplicationCard
                  application={application}
                  onStatusChange={handleStatusChange}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No applications found
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "No applications have been submitted yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationsList;
