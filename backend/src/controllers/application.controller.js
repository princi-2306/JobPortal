import { Application } from "../models/Application.model.js";
import { Job } from "../models/Job.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";

// ── Create Application ────────────────────────────────────────────────────────
const createApplication = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { jobId } = req.params;

  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check for duplicate application
  const alreadyApplied = await Application.findOne({
    job: jobId,
    user: userId,
  });
  if (alreadyApplied) {
    throw new ApiError(400, "You have already applied to this job");
  }

  // ✅ Fix 1: guard against missing resume file properly
  const resumeBuffer = req.files?.resume?.[0]?.buffer;
  if (!resumeBuffer) {
    throw new ApiError(400, "Please upload a resume");
  }

  // ✅ Fix 2: pass buffer wrapped in array as your UploadOnCloudinary expects
  const resume = await UploadOnCloudinary([resumeBuffer]);
  if (!resume || !resume[0]?.url) {
    throw new ApiError(400, "Failed to upload resume");
  }

  // Create application
  const application = await Application.create({
    job: jobId,
    user: userId,
    resume: resume[0].url,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, application, "Job application created successfully!"));
});

// ── Get All Jobs Applied (User Dashboard) ─────────────────────────────────────
const getAllJobsApplied = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const applications = await Application.find({ user: userId })
    .populate("job")
    .sort({ createdAt: -1 }); // ✅ Fix 3: was "created", correct field is "createdAt"

  return res
    .status(200)
    .json(new ApiResponse(200, applications, "User applications fetched successfully!"));
});

// ── Get All Applications (Admin Dashboard) ────────────────────────────────────
const getAllAdminApplications = asyncHandler(async (req, res) => {
  // ✅ Fix 4: was req.user._id but verifyAdminJWT sets req.admin not req.user
  const adminId = req.admin._id;

  // Get all jobs posted by this admin
  const jobs = await Job.find({ recruiter: adminId }).select("_id");

  // ✅ Fix 5: was "join.map" — typo, should be "jobs.map"
  const jobIds = jobs.map((job) => job._id);

  // Get applications for those jobs
  const applications = await Application.find({ job: { $in: jobIds } })
    .populate("user", "username email")
    .populate("job", "jobTitle companyName jobPlace");

  return res
    .status(200)
    .json(new ApiResponse(200, applications, "Admin applications fetched successfully!"));
});

// ── Get Application Details ───────────────────────────────────────────────────
const getApplicationDetails = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const application = await Application.findById(applicationId)
    .populate("user")
    .populate("job");

  if (!application) {
    throw new ApiError(404, "Application not found"); // ✅ Fix 6: use ApiError not ApiResponse for errors
  }

  return res
    .status(200)
    .json(new ApiResponse(200, application, "Application details fetched successfully!"));
});

// ── Get Application Count ─────────────────────────────────────────────────────
const getApplicationCount = asyncHandler(async (req, res) => {
  // ✅ Fix 7: route param is :id not :jobId — match what's in your router
  const { id } = req.params;

  const count = await Application.countDocuments({ job: id });

  return res
    .status(200)
    .json(new ApiResponse(200, { applicationCount: count }, "Application count fetched successfully!"));
});

export {
  getAllAdminApplications,
  getAllJobsApplied,
  getApplicationCount,
  getApplicationDetails,
  createApplication,
};