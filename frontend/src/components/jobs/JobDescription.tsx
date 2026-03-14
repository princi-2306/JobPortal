// components/jobs/JobDescription.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  CheckBadgeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import type { Job } from "../../store/jobStore";

interface JobDescriptionProps {
  job: Job;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ job }) => {
  const sections = [
    {
      title: "Job Description",
      icon: null,
      content: job.jobDescription,
      type: "text",
    },
    {
      title: "Requirements",
      icon: CheckBadgeIcon,
      items: job.requirements,
      type: "list",
      iconColor: "text-green-500",
    },
    {
      title: "Responsibilities",
      icon: BriefcaseIcon,
      items: job.responsibilities,
      type: "list",
      iconColor: "text-blue-500",
    },
    {
      title: "Benefits",
      icon: CurrencyDollarIcon,
      items: job.benefits,
      type: "list",
      iconColor: "text-purple-500",
    },
    {
      title: "Required Skills",
      icon: null,
      items: job.requiredSkills,
      type: "skills",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {sections.map((section, index) => {
        if (section.type === "text" && section.content) {
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          );
        }

        if (section.type === "list" && section.items?.length > 0) {
          const Icon = section.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start">
                    {Icon && (
                      <Icon
                        className={`h-5 w-5 ${section.iconColor} mr-2 flex-shrink-0 mt-0.5`}
                      />
                    )}
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (section.type === "skills" && section.items?.length > 0) {
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {section.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}
    </motion.div>
  );
};

export default JobDescription;
