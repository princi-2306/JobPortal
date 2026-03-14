// components/jobs/JobSearch.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import useJobStore from "../../store/jobStore";

interface JobSearchProps {
  onToggleFilters?: () => void;
  showFilters?: boolean;
}

const JobSearch: React.FC<JobSearchProps> = ({
  onToggleFilters,
  showFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { updateFilters } = useJobStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSearch}
      className="mb-6"
    >
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        {onToggleFilters && (
          <button
            type="button"
            onClick={onToggleFilters}
            className="px-4 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon
              className={`h-5 w-5 ${showFilters ? "text-blue-600" : "text-gray-600"}`}
            />
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default JobSearch;
