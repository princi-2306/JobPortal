// pages/Jobs.tsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import useJobStore from "../store/jobStore";
import JobSearch from "../components/jobs/JobSearch";
import JobFilters from "../components/jobs/JobFilters";
import JobCard from "../components/jobs/JobCard";
import JobStats from "../components/jobs/JobStats";
import JobLoading from "../components/jobs/JobLoading";
import NoJobsFound from "../components/jobs/NoJobsFound";

const Jobs: React.FC = () => {
  const { filteredJobs, isLoading, fetchAllJobs } = useJobStore();

  useEffect(() => {
    fetchAllJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-gray-600">
            Browse through thousands of jobs and find the perfect opportunity
          </p>
        </motion.div>

        {/* Search and Filters */}
        <JobSearch />
        <JobFilters />

        {/* Job Stats */}
        <JobStats count={filteredJobs.length} />

        {/* Job Cards Grid */}
        {isLoading ? (
          <JobLoading />
        ) : filteredJobs.length > 0 ? (
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </motion.div>
        ) : (
          <NoJobsFound />
        )}
      </div>
    </div>
  );
};

export default Jobs;
