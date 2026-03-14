// components/jobs/JobCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type { Job } from "../../store/jobStore";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const postedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <Link to={`/jobs/${job._id}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {job.companyName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {job.jobTitle}
                </h3>
                <p className="text-sm text-gray-600">{job.companyName}</p>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2" />
              {job.jobPlace}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <BriefcaseIcon className="h-4 w-4 mr-2" />
              {job.jobType || "Full-time"} • {job.jobLevel}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CurrencyDollarIcon className="h-4 w-4 mr-2" />$
              {job.salary.toLocaleString()}/year
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <ClockIcon className="h-4 w-4 mr-2" />
              Posted {postedDate}
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.requiredSkills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                +{job.requiredSkills.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              {job.applicants?.length || 0} applicants
            </span>
            <span className="text-blue-600 font-semibold text-sm hover:text-blue-700">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default JobCard;
