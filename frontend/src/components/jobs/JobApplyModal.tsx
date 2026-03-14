// // // components/jobs/JobApplyModal.tsx
// // import React, { useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   XMarkIcon,
// //   PaperAirplaneIcon,
// //   CheckBadgeIcon,
// // } from "@heroicons/react/24/outline";
// // import useJobStore from "../../store/jobStore";
// // import useAuthStore from "../../store/authStore";
// // import useApplicationStore from "../../store/applicationStore";
// // import type { Job } from "../../store/jobStore";

// // interface JobApplyModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   job: Job;
// // }

// // const JobApplyModal: React.FC<JobApplyModalProps> = ({
// //   isOpen,
// //   onClose,
// //   job,
// // }) => {
// //   const { createApplication } = useApplicationStore(); // You'll need to add this to your store
// //   const { user } = useAuthStore();

// //   const [applicationData, setApplicationData] = useState({
// //     resume: "",
// //     coverLetter: "",
// //   });
// //   const [status, setStatus] = useState<
// //     "idle" | "submitting" | "success" | "error"
// //   >("idle");

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setStatus("submitting");

// //     try {
// //       // You'll need to implement this in your job store
// //       const success = await createApplication(job._id, applicationData.resume);

// //       if (success) {
// //         setStatus("success");
// //         setTimeout(() => {
// //           onClose();
// //           setStatus("idle");
// //           setApplicationData({ resume: "", coverLetter: "" });
// //         }, 2000);
// //       } else {
// //         setStatus("error");
// //       }
// //     } catch (error) {
// //       setStatus("error");
// //     }
// //   };

// //   return (
// //     <AnimatePresence>
// //       {isOpen && (
// //         <motion.div
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           exit={{ opacity: 0 }}
// //           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
// //           onClick={onClose}
// //         >
// //           <motion.div
// //             initial={{ scale: 0.9, y: 20 }}
// //             animate={{ scale: 1, y: 0 }}
// //             exit={{ scale: 0.9, y: 20 }}
// //             className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <div className="p-6">
// //               <div className="flex items-center justify-between mb-4">
// //                 <h2 className="text-2xl font-bold text-gray-900">
// //                   Apply for {job.jobTitle}
// //                 </h2>
// //                 <button
// //                   onClick={onClose}
// //                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// //                 >
// //                   <XMarkIcon className="h-5 w-5 text-gray-500" />
// //                 </button>
// //               </div>

// //               {status === "success" ? (
// //                 <div className="text-center py-8">
// //                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //                     <CheckBadgeIcon className="h-8 w-8 text-green-600" />
// //                   </div>
// //                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
// //                     Application Submitted!
// //                   </h3>
// //                   <p className="text-gray-600">
// //                     Your application has been successfully submitted.
// //                   </p>
// //                 </div>
// //               ) : (
// //                 <form onSubmit={handleSubmit} className="space-y-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Full Name
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={user?.name || ""}
// //                       disabled
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Email Address
// //                     </label>
// //                     <input
// //                       type="email"
// //                       value={user?.email || ""}
// //                       disabled
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Resume Link (Google Drive, Dropbox, etc.)
// //                     </label>
// //                     <input
// //                       type="url"
// //                       value={applicationData.resume}
// //                       onChange={(e) =>
// //                         setApplicationData({
// //                           ...applicationData,
// //                           resume: e.target.value,
// //                         })
// //                       }
// //                       required
// //                       placeholder="https://..."
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Cover Letter (Optional)
// //                     </label>
// //                     <textarea
// //                       value={applicationData.coverLetter}
// //                       onChange={(e) =>
// //                         setApplicationData({
// //                           ...applicationData,
// //                           coverLetter: e.target.value,
// //                         })
// //                       }
// //                       rows={5}
// //                       placeholder="Tell us why you're interested in this position..."
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
// //                     />
// //                   </div>

// //                   {status === "error" && (
// //                     <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
// //                       <p className="text-red-600 text-sm">
// //                         Failed to submit application. Please try again.
// //                       </p>
// //                     </div>
// //                   )}

// //                   <div className="flex space-x-3 pt-4">
// //                     <button
// //                       type="button"
// //                       onClick={onClose}
// //                       className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
// //                     >
// //                       Cancel
// //                     </button>
// //                     <button
// //                       type="submit"
// //                       disabled={status === "submitting"}
// //                       className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
// //                     >
// //                       {status === "submitting" ? (
// //                         <span className="flex items-center justify-center">
// //                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
// //                           Submitting...
// //                         </span>
// //                       ) : (
// //                         <span className="flex items-center justify-center">
// //                           <PaperAirplaneIcon className="h-5 w-5 mr-2" />
// //                           Submit Application
// //                         </span>
// //                       )}
// //                     </button>
// //                   </div>
// //                 </form>
// //               )}
// //             </div>
// //           </motion.div>
// //         </motion.div>
// //       )}
// //     </AnimatePresence>
// //   );
// // };

// // export default JobApplyModal;

// // components/jobs/JobApplyModal.tsx
// import React, { useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   XMarkIcon,
//   PaperAirplaneIcon,
//   CheckBadgeIcon,
//   DocumentArrowUpIcon,
//   DocumentTextIcon,
//   TrashIcon,
// } from "@heroicons/react/24/outline";
// import useJobStore from "../../store/jobStore";
// import useAuthStore from "../../store/authStore";
// import useApplicationStore from "../../store/applicationStore";
// import type { Job } from "../../store/jobStore";

// interface JobApplyModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   job: Job;
// }

// const JobApplyModal: React.FC<JobApplyModalProps> = ({
//   isOpen,
//   onClose,
//   job,
// }) => {
//   const { createApplication } = useApplicationStore();
//   const { user } = useAuthStore();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [applicationData, setApplicationData] = useState({
//     resume: "",
//     coverLetter: "",
//     resumeFile: null as File | null,
//   });
//   const [status, setStatus] = useState<
//     "idle" | "submitting" | "success" | "error"
//   >("idle");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [fileError, setFileError] = useState<string | null>(null);

//   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
//   const ALLOWED_FILE_TYPES = ["application/pdf"];

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     setFileError(null);

//     if (file) {
//       // Validate file type
//       if (!ALLOWED_FILE_TYPES.includes(file.type)) {
//         setFileError("Please upload a PDF file only");
//         return;
//       }

//       // Validate file size
//       if (file.size > MAX_FILE_SIZE) {
//         setFileError("File size should be less than 5MB");
//         return;
//       }

//       setApplicationData({
//         ...applicationData,
//         resumeFile: file,
//         resume: file.name, // Store filename for display
//       });

//       // Simulate upload progress (you can replace with actual upload logic)
//       simulateUploadProgress();
//     }
//   };

//   const simulateUploadProgress = () => {
//     setUploadProgress(0);
//     const interval = setInterval(() => {
//       setUploadProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 100);
//   };

//   const handleRemoveFile = () => {
//     setApplicationData({
//       ...applicationData,
//       resumeFile: null,
//       resume: "",
//     });
//     setUploadProgress(0);
//     setFileError(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setStatus("submitting");

//     try {
//       // Here you would typically upload the file to your storage service
//       // and get back a URL to store in your database
      
//       let resumeUrl = applicationData.resume;
      
//       // If there's a file, upload it first
//       if (applicationData.resumeFile) {
//         // TODO: Implement actual file upload to your storage service
//         // const uploadedUrl = await uploadFile(applicationData.resumeFile);
//         // resumeUrl = uploadedUrl;
        
//         // For now, we'll simulate an upload
//         await new Promise(resolve => setTimeout(resolve, 1500));
//       }

//       const success = await createApplication(job._id, );

//       if (success) {
//         setStatus("success");
//         setTimeout(() => {
//           onClose();
//           setStatus("idle");
//           setApplicationData({ resume: "", coverLetter: "", resumeFile: null });
//           setUploadProgress(0);
//         }, 2000);
//       } else {
//         setStatus("error");
//       }
//     } catch (error) {
//       setStatus("error");
//     }
//   };

//   // const formatFileSize = (bytes: number) => {
//   //   if (bytes === 0) return "0 Bytes";
//   //   const k = 1024;
//   //   const sizes = ["Bytes", "KB", "MB", "GB"];
//   //   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   // };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.9, y: 20 }}
//             animate={{ scale: 1, y: 0 }}
//             exit={{ scale: 0.9, y: 20 }}
//             className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Apply for {job.jobTitle}
//                 </h2>
//                 <button
//                   onClick={onClose}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <XMarkIcon className="h-5 w-5 text-gray-500" />
//                 </button>
//               </div>

//               {status === "success" ? (
//                 <div className="text-center py-8">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <CheckBadgeIcon className="h-8 w-8 text-green-600" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                     Application Submitted!
//                   </h3>
//                   <p className="text-gray-600">
//                     Your application has been successfully submitted.
//                   </p>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       value={user?.name || ""}
//                       disabled
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       value={user?.email || ""}
//                       disabled
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Upload Resume (PDF)
//                     </label>
//                     <div className="space-y-3">
//                       {/* File Upload Area */}
//                       <div
//                         className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//                           fileError
//                             ? "border-red-300 bg-red-50"
//                             : applicationData.resumeFile
//                             ? "border-green-300 bg-green-50"
//                             : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
//                         }`}
//                       >
//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           accept=".pdf,application/pdf"
//                           onChange={handleFileChange}
//                           className="hidden"
//                           id="resume-upload"
//                         />
                        
//                         {!applicationData.resumeFile ? (
//                           <label
//                             htmlFor="resume-upload"
//                             className="cursor-pointer block"
//                           >
//                             <DocumentArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                             <p className="text-sm text-gray-600 mb-1">
//                               Click to upload or drag and drop
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               PDF only (max 5MB)
//                             </p>
//                           </label>
//                         ) : (
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                               <DocumentTextIcon className="h-8 w-8 text-blue-600" />
//                               <div className="text-left">
//                                 <p className="text-sm font-medium text-gray-900">
//                                   {applicationData.resumeFile.name}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                   {formatFileSize(applicationData.resumeFile.size)}
//                                 </p>
//                               </div>
//                             </div>
//                             <button
//                               type="button"
//                               onClick={handleRemoveFile}
//                               className="p-1 hover:bg-red-100 rounded-full transition-colors"
//                             >
//                               <TrashIcon className="h-5 w-5 text-red-600" />
//                             </button>
//                           </div>
//                         )}
//                       </div>

//                       {/* Upload Progress Bar */}
//                       {uploadProgress > 0 && uploadProgress < 100 && (
//                         <div className="space-y-1">
//                           <div className="flex justify-between text-xs text-gray-600">
//                             <span>Uploading...</span>
//                             <span>{uploadProgress}%</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                               style={{ width: `${uploadProgress}%` }}
//                             />
//                           </div>
//                         </div>
//                       )}

//                       {/* File Error Message */}
//                       {fileError && (
//                         <p className="text-sm text-red-600 mt-1">{fileError}</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Resume Link Alternative */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Or Resume Link (Google Drive, Dropbox, etc.)
//                     </label>
//                     <input
//                       type="url"
//                       value={applicationData.resume}
//                       onChange={(e) =>
//                         setApplicationData({
//                           ...applicationData,
//                           resume: e.target.value,
//                           resumeFile: null, // Clear file if link is provided
//                         })
//                       }
//                       disabled={!!applicationData.resumeFile}
//                       placeholder="https://..."
//                       className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
//                         applicationData.resumeFile ? "bg-gray-50" : ""
//                       }`}
//                     />
//                     {applicationData.resumeFile && (
//                       <p className="text-xs text-gray-500 mt-1">
//                         Clear file upload to use a link instead
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Cover Letter (Optional)
//                     </label>
//                     <textarea
//                       value={applicationData.coverLetter}
//                       onChange={(e) =>
//                         setApplicationData({
//                           ...applicationData,
//                           coverLetter: e.target.value,
//                         })
//                       }
//                       rows={5}
//                       placeholder="Tell us why you're interested in this position..."
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                     />
//                   </div>

//                   {status === "error" && (
//                     <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                       <p className="text-red-600 text-sm">
//                         Failed to submit application. Please try again.
//                       </p>
//                     </div>
//                   )}

//                   <div className="flex space-x-3 pt-4">
//                     <button
//                       type="button"
//                       onClick={onClose}
//                       className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={
//                         status === "submitting" ||
//                         (!applicationData.resume && !applicationData.resumeFile) ||
//                         !!fileError
//                       }
//                       className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {status === "submitting" ? (
//                         <span className="flex items-center justify-center">
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                           Submitting...
//                         </span>
//                       ) : (
//                         <span className="flex items-center justify-center">
//                           <PaperAirplaneIcon className="h-5 w-5 mr-2" />
//                           Submit Application
//                         </span>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default JobApplyModal;

// components/jobs/JobApplyModal.tsx

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  CheckBadgeIcon,
  DocumentArrowUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import useApplicationStore from "../../store/applicationStore";
import type { Job } from "../../store/jobStore";

interface JobApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

const JobApplyModal: React.FC<JobApplyModalProps> = ({
  isOpen,
  onClose,
  job,
}) => {
  const { createApplication } = useApplicationStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const [fileError, setFileError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileError("Only PDF files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be less than 5MB");
      return;
    }

    setResumeFile(file);
    setFileError(null);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setFileError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      setFileError("Please upload your resume");
      return;
    }

    setStatus("submitting");

    try {
      const formData = new FormData();

      formData.append("resume", resumeFile);
      formData.append("coverLetter", coverLetter);
      formData.append("jobId", job._id);

      const success = await createApplication(job._id,resumeFile);

      if (success) {
        setStatus("success");

        setTimeout(() => {
          onClose();
          setStatus("idle");
          setResumeFile(null);
          setCoverLetter("");
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}

              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold">
                  Apply for {job.jobTitle}
                </h2>

                <button onClick={onClose}>
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {status === "success" ? (
                <div className="text-center py-6">
                  <CheckBadgeIcon className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <p className="text-lg font-semibold">
                    Application Submitted
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Resume Upload */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Upload Resume (PDF)
                    </label>

                    <div className="border-2 border-dashed rounded-lg p-6 text-center">

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resumeUpload"
                      />

                      {!resumeFile ? (
                        <label
                          htmlFor="resumeUpload"
                          className="cursor-pointer"
                        >
                          <DocumentArrowUpIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />

                          <p className="text-sm text-gray-600">
                            Click to upload PDF resume
                          </p>

                          <p className="text-xs text-gray-500">
                            Max size: 5MB
                          </p>
                        </label>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {resumeFile.name}
                          </p>

                          <button
                            type="button"
                            onClick={handleRemoveFile}
                          >
                            <TrashIcon className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>

                    {fileError && (
                      <p className="text-red-500 text-sm mt-1">
                        {fileError}
                      </p>
                    )}
                  </div>

                  {/* Cover Letter */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cover Letter
                    </label>

                    <textarea
                      rows={5}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Write your cover letter..."
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-500 text-sm">
                      Failed to submit application
                    </p>
                  )}

                  {/* Buttons */}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 border py-2 rounded-lg"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      {status === "submitting" ? (
                        "Submitting..."
                      ) : (
                        <>
                          <PaperAirplaneIcon className="h-4 w-4" />
                          Apply
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobApplyModal;