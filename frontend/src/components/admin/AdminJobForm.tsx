import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import useJobStore from "../../store/jobStore";
import type { CreateJobData} from "../../store/jobStore";

interface AdminJobFormProps {
  jobId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminJobForm: React.FC<AdminJobFormProps> = ({
  jobId,
  onSuccess,
  onCancel,
}) => {
  const { createJob, updateJob, jobs, isLoading } = useJobStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateJobData>({
    jobTitle: "",
    companyName: "",
    jobPlace: "",
    salary: 0,
    jobType: "Full-time",
    jobLevel: "mid",
    jobDescription: "",
    requirements: [""],
    responsibilities: [""],
    benefits: [""],
    requiredSkills: [""],
  });

  // Load job data if editing
  useEffect(() => {
    if (jobId) {
      const job = jobs.find((j) => j._id === jobId);
      if (job) {
        setFormData({
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          jobPlace: job.jobPlace,
          salary: job.salary,
          jobType: job.jobType || "Full-time",
          jobLevel: job.jobLevel,
          jobDescription: job.jobDescription || "",
          requirements: job.requirements.length ? job.requirements : [""],
          responsibilities: job.responsibilities.length
            ? job.responsibilities
            : [""],
          benefits: job.benefits.length ? job.benefits : [""],
          requiredSkills: job.requiredSkills.length ? job.requiredSkills : [""],
        });
      }
    }
  }, [jobId, jobs]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayInput = (
    field: "requirements" | "responsibilities" | "benefits" | "requiredSkills",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (
    field: "requirements" | "responsibilities" | "benefits" | "requiredSkills",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (
    field: "requirements" | "responsibilities" | "benefits" | "requiredSkills",
    index: number,
  ) => {
    if (formData[field].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.jobPlace.trim()) newErrors.jobPlace = "Location is required";
    if (formData.salary <= 0)
      newErrors.salary = "Salary must be greater than 0";
    if (!formData.jobDescription?.trim())
      newErrors.jobDescription = "Job description is required";

    // Validate arrays have at least one non-empty item
    if (!formData.requirements.some((r) => r.trim())) {
      newErrors.requirements = "At least one requirement is required";
    }
    if (!formData.responsibilities.some((r) => r.trim())) {
      newErrors.responsibilities = "At least one responsibility is required";
    }
    if (!formData.requiredSkills.some((s) => s.trim())) {
      newErrors.requiredSkills = "At least one required skill is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Clean up empty array items
    const cleanedData = {
      ...formData,
      requirements: formData.requirements.filter((r) => r.trim()),
      responsibilities: formData.responsibilities.filter((r) => r.trim()),
      benefits: formData.benefits.filter((b) => b.trim()),
      requiredSkills: formData.requiredSkills.filter((s) => s.trim()),
    };

    let success;
    if (jobId) {
      success = await updateJob(jobId, cleanedData);
    } else {
      success = await createJob(cleanedData);
    }

    if (success) {
      onSuccess();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {jobId ? "Edit Job" : "Post New Job"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <div className="relative">
              <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>
            {errors.jobTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Your Company Name"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="jobPlace"
                value={formData.jobPlace}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="e.g., New York, NY (Remote)"
              />
            </div>
            {errors.jobPlace && (
              <p className="text-red-500 text-sm mt-1">{errors.jobPlace}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary (USD) *
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="salary"
                value={formData.salary || ""}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="80000"
              />
            </div>
            {errors.salary && (
              <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Level *
            </label>
            <select
              name="jobLevel"
              value={formData.jobLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="fresher">Fresher</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description *
          </label>
          <div className="relative">
            <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              rows={6}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Describe the job role, responsibilities, and ideal candidate..."
            />
          </div>
          {errors.jobDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>
          )}
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requirements *
          </label>
          <div className="space-y-2">
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) =>
                    handleArrayInput("requirements", index, e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder={`Requirement ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("requirements", index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("requirements")}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Requirement</span>
            </button>
          </div>
          {errors.requirements && (
            <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
          )}
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsibilities *
          </label>
          <div className="space-y-2">
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) =>
                    handleArrayInput("responsibilities", index, e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder={`Responsibility ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("responsibilities", index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("responsibilities")}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Responsibility</span>
            </button>
          </div>
          {errors.responsibilities && (
            <p className="text-red-500 text-sm mt-1">
              {errors.responsibilities}
            </p>
          )}
        </div>

        {/* Required Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills *
          </label>
          <div className="space-y-2">
            {formData.requiredSkills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) =>
                    handleArrayInput("requiredSkills", index, e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder={`Skill ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("requiredSkills", index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("requiredSkills")}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Skill</span>
            </button>
          </div>
          {errors.requiredSkills && (
            <p className="text-red-500 text-sm mt-1">{errors.requiredSkills}</p>
          )}
        </div>

        {/* Benefits (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Benefits (Optional)
          </label>
          <div className="space-y-2">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) =>
                    handleArrayInput("benefits", index, e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder={`Benefit ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("benefits", index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("benefits")}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Benefit</span>
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : jobId ? "Update Job" : "Post Job"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminJobForm;
