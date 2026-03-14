// components/jobs/JobHeader.tsx
import React from "react";
import { motion } from "framer-motion";
import { BuildingOfficeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import type { Job } from "../../store/jobStore";

interface JobHeaderProps {
  job: Job;
}

const JobHeader: React.FC<JobHeaderProps> = ({ job }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-8 mb-6"
    >
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {job.companyName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {job.jobTitle}
          </h1>
          <div className="flex items-center space-x-4 text-gray-600">
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
    </motion.div>
  );
};

export default JobHeader;
