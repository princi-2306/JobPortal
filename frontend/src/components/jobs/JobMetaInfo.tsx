// components/jobs/JobMetaInfo.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import type { Job } from "../../store/jobStore";

interface JobMetaInfoProps {
  job: Job;
}

const JobMetaInfo: React.FC<JobMetaInfoProps> = ({ job }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-4">
        <p className="text-sm text-gray-500 mb-1">Job Type</p>
        <div className="flex items-center">
          <BriefcaseIcon className="h-5 w-5 text-blue-600 mr-2" />
          <p className="font-semibold text-gray-900">
            {job.jobType || "Full-time"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <p className="text-sm text-gray-500 mb-1">Experience</p>
        <p className="font-semibold text-gray-900 capitalize">{job.jobLevel}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <p className="text-sm text-gray-500 mb-1">Salary</p>
        <div className="flex items-center">
          <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
          <p className="font-semibold text-gray-900">
            ${job.salary.toLocaleString()}/year
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <p className="text-sm text-gray-500 mb-1">Applicants</p>
        <div className="flex items-center">
          <UserGroupIcon className="h-5 w-5 text-purple-600 mr-2" />
          <p className="font-semibold text-gray-900">
            {job.applicants?.length || 0}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default JobMetaInfo;
