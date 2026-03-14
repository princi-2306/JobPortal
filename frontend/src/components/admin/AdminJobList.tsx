import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BriefcaseIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import AdminJobCard from "./AdminJobCard";
import type { Job } from "../../store/jobStore";

interface AdminJobListProps {
  jobs: Job[];
  isLoading: boolean;
  onEdit: (jobId: string) => void;
  onViewApplications: (jobId: string) => void;
}

const AdminJobList: React.FC<AdminJobListProps> = ({
  jobs,
  isLoading,
  onEdit,
  onViewApplications,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "expired"
  >("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "most-applications"
  >("newest");

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter((job) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          job.jobTitle.toLowerCase().includes(search) ||
          job.companyName.toLowerCase().includes(search) ||
          job.jobPlace.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .filter((job) => {
      // Status filter
      if (filterStatus === "active") {
        return (
          new Date(job.createdAt) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );
      }
      if (filterStatus === "expired") {
        return (
          new Date(job.createdAt) <=
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortBy === "most-applications") {
        return (b.applicants?.length || 0) - (a.applicants?.length || 0);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Jobs</h2>
        <p className="text-gray-600">Total: {filteredJobs.length} jobs</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none bg-white"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active (Last 30 days)</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <ArrowPathIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-applications">Most Applications</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setSortBy("newest");
            }}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredJobs.length > 0 ? (
        <AnimatePresence>
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <AdminJobCard
                  job={job}
                  onEdit={() => onEdit(job._id)}
                  onViewApplications={() => onViewApplications(job._id)}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <div className="text-center py-12">
          <BriefcaseIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your filters"
              : 'Click "Post New Job" to create your first job posting'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminJobList;
