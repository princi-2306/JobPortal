// components/jobs/JobApplyButton.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface JobApplyButtonProps {
  isAuthenticated: boolean;
  onApply: () => void;
}

const JobApplyButton: React.FC<JobApplyButtonProps> = ({
  isAuthenticated,
  onApply,
}) => {
  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <p className="text-yellow-700">
          Please{" "}
          <Link
            to="/login"
            className="font-semibold underline hover:text-yellow-800"
          >
            log in
          </Link>{" "}
          to apply for this position
        </p>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onApply}
      className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all mb-6"
    >
      Apply for this position
    </motion.button>
  );
};

export default JobApplyButton;
