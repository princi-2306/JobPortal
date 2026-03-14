import React from "react";
import { motion } from "framer-motion";
import type { AdminTab } from "./AdminDashboard";

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "overview" as AdminTab, label: "Overview" },
    { id: "post-job" as AdminTab, label: "Post Job" },
    { id: "manage-jobs" as AdminTab, label: "Manage Jobs" },
    { id: "applications" as AdminTab, label: "Applications" },
    { id: "profile" as AdminTab, label: "Profile" },
  ];

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
};

export default AdminTabs;
