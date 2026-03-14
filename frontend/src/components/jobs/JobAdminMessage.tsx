// components/jobs/JobAdminMessage.tsx
import React from "react";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

const JobAdminMessage: React.FC = () => {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
      <p className="text-purple-700 flex items-center">
        <BuildingOfficeIcon className="h-5 w-5 mr-2" />
        You are viewing as an admin. You cannot apply for jobs.
      </p>
    </div>
  );
};

export default JobAdminMessage;
