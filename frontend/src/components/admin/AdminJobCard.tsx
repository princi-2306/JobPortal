import React from "react";
import { motion } from "framer-motion";
import {
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import useJobStore from "../../store/jobStore";
import type { Job } from "../../store/jobStore";

interface AdminJobCardProps {
  job: Job;
  onEdit: () => void;
  onViewApplications: () => void;
}

const AdminJobCard: React.FC<AdminJobCardProps> = ({
  job,
  onEdit,
  onViewApplications,
}) => {
  const { deleteJob } = useJobStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleDelete = async () => {
    const success = await deleteJob(job._id);
    if (success) {
      setShowDeleteConfirm(false);
    }
  };

  const postedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isActive =
    new Date(job.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                {job.jobTitle}
              </h3>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {isActive ? "Active" : "Expired"}
              </span>
            </div>
            <p className="text-gray-600">{job.companyName}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Job"
            >
              <PencilIcon className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Job"
            >
              <TrashIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4" />
            <span>{job.jobPlace}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CurrencyDollarIcon className="h-4 w-4" />
            <span>${job.salary.toLocaleString()}/year</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BriefcaseIcon className="h-4 w-4" />
            <span className="capitalize">{job.jobLevel}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>{postedDate}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.requiredSkills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full"
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

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <UserGroupIcon className="h-4 w-4" />
              <span>{job.applicants?.length || 0} Applicants</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewApplications}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <DocumentTextIcon className="h-4 w-4" />
            <span>View Applications</span>
          </motion.button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Job</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{job.jobTitle}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminJobCard;
