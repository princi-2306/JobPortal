import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import useJobStore from "../store/jobStore";
import useAuthStore from "../store/authStore";
import JobHeader from "../components/jobs/JobHeader";
import JobMetaInfo from "../components/jobs/JobMetaInfo";
import JobDescription from "../components/jobs/JobDescription";
import JobApplyButton from "../components/jobs/JobApplyButton";
import JobApplyModal from "../components/jobs/JobApplyModal";
import JobAdminMessage from "../components/jobs/JobAdminMessage";

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedJob, setSelectedJob, fetchJobById, isLoading } = useJobStore();
  const { isAuthenticated, isAdmin } = useAuthStore();

  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobById(id);
    }

    return () => {
      setSelectedJob(null);
    };
  }, [id]);

  if (isLoading || !selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/jobs")}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Jobs</span>
        </motion.button>

        {/* Job Header */}
        <JobHeader job={selectedJob} />

        {/* Job Meta Info */}
        <JobMetaInfo job={selectedJob} />

        {/* Apply Button or Admin Message */}
        {isAdmin() ? (
          <JobAdminMessage />
        ) : (
          <JobApplyButton
            isAuthenticated={isAuthenticated}
            onApply={() => setShowApplyModal(true)}
          />
        )}

        {/* Job Details Sections */}
        <JobDescription job={selectedJob} />
      </div>

      {/* Apply Modal */}
      <JobApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        job={selectedJob}
      />
    </div>
  );
};

export default JobDetail;