import React from "react";
import { motion } from "framer-motion";
import {
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import type { AdminTab } from "./AdminDashboard";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminName: string;
  adminEmail: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  adminName,
  adminEmail,
}) => {
  const menuItems = [
    { id: "overview" as AdminTab, label: "Overview", icon: HomeIcon },
    { id: "post-job" as AdminTab, label: "Post New Job", icon: PlusCircleIcon },
    {
      id: "manage-jobs" as AdminTab,
      label: "Manage Jobs",
      icon: BriefcaseIcon,
    },
    {
      id: "applications" as AdminTab,
      label: "Applications",
      icon: DocumentTextIcon,
    },
    { id: "profile" as AdminTab, label: "Profile", icon: UserCircleIcon },
  ];

  return (
    <motion.div
      className="lg:w-72 bg-white rounded-2xl shadow-lg p-6 h-fit"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Admin Info */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {adminName.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">{adminName}</h3>
        <p className="text-sm text-gray-500">{adminEmail}</p>
        <div className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold inline-block">
          Admin
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`}
              />
              <span className="font-medium">{item.label}</span>
              {item.id === "applications" && (
                <span
                  className={`ml-auto px-2 py-1 text-xs rounded-full ${
                    isActive
                      ? "bg-white text-purple-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

    
  
    </motion.div>
  );
};

export default AdminSidebar;
