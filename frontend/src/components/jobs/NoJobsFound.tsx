// components/jobs/NoJobsFound.tsx
import React from "react";
import { BriefcaseIcon } from "@heroicons/react/24/outline";

const NoJobsFound: React.FC = () => {
  return (
    <div className="text-center py-12">
      <BriefcaseIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No jobs found
      </h3>
      <p className="text-gray-600">
        Try adjusting your search or filters to find what you're looking for.
      </p>
    </div>
  );
};

export default NoJobsFound;
