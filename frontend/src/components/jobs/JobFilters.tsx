// components/jobs/JobFilters.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FunnelIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import useJobStore from "../../store/jobStore";

const JobFilters: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { updateFilters, resetFilters, sortJobs } = useJobStore();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 200000 });

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Remote",
    "Internship",
  ];
  const jobLevels = ["fresher", "mid", "senior"];

  const handleTypeFilter = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    updateFilters({ jobType: newTypes });
  };

  const handleLevelFilter = (level: string) => {
    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.filter((l) => l !== level)
      : [...selectedLevels, level];
    setSelectedLevels(newLevels);
    updateFilters({
      jobLevel: newLevels as ("fresher" | "mid" | "senior")[],
    });
  };

  const handleSalaryFilter = () => {
    updateFilters({ salary: salaryRange });
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedLevels([]);
    setSalaryRange({ min: 0, max: 200000 });
    resetFilters();
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-2"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>Filters</span>
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeFilter(type)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <div className="space-y-2">
                  {jobLevels.map((level) => (
                    <label key={level} className="flex items-center capitalize">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level)}
                        onChange={() => handleLevelFilter(level)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range (USD)
                </label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="10000"
                      value={salaryRange.min}
                      onChange={(e) =>
                        setSalaryRange({
                          ...salaryRange,
                          min: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${salaryRange.min.toLocaleString()}</span>
                      <span>${salaryRange.max.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleSalaryFilter}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Apply Salary Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                onChange={(e) =>
                  sortJobs(e.target.value as "recent" | "salary" | "relevance")
                }
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="recent">Most Recent</option>
                <option value="salary">Highest Salary</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobFilters;
