// components/jobs/JobStats.tsx
import React from "react";

interface JobStatsProps {
  count: number;
}

const JobStats: React.FC<JobStatsProps> = ({ count }) => {
  return (
    <div className="mb-6">
      <p className="text-gray-600">
        Showing <span className="font-semibold text-gray-900">{count}</span>{" "}
        jobs
      </p>
    </div>
  );
};

export default JobStats;
