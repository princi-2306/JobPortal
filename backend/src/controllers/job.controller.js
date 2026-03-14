import asyncHandler from "../utils/asyncHandler.js";
import { Job } from "../models/Job.model.js";
import { Admin } from "../models/Admin.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// ── Post Job ──────────────────────────────────────────────────────────────────
const postJob = asyncHandler(async (req, res) => {
  const {
    jobTitle,
    companyName,
    jobPlace,
    salary,
    jobType,
    jobLevel,
    jobDescription,
    requirements,
    responsibilities,
    benefits,
    requiredSkills,
  } = req.body;

  // ✅ Validate required fields
  if (!jobTitle || !companyName || !jobDescription) {
    throw new ApiError(400, "jobTitle, companyName and jobDescription are required");
  }

  // ✅ Use req.admin._id (verifyAdminJWT sets req.admin, not req.user)
  const recruiter = await Admin.findById(req.admin._id);
  if (!recruiter) {
    throw new ApiError(404, "Admin/Recruiter not found");
  }

  const job = await Job.create({
    jobTitle,
    companyName,
    jobPlace,
    salary,
    jobType,
    jobLevel,
    jobDescription,
    requirements,
    responsibilities,
    benefits,
    requiredSkills,
    recruiter: recruiter._id,
  });

  return res
    .status(201) // ✅ 201 for resource creation
    .json(new ApiResponse(201, job, "Job posted successfully!"));
});

// ── Delete Job ────────────────────────────────────────────────────────────────
const deleteJob = asyncHandler(async (req, res) => {
  // ✅ Was: req.params (returns whole object), should be req.params.id
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Job ID is required");
  }

  const job = await Job.findByIdAndDelete(id);

  // ✅ Check after attempting delete, not before
  if (!job) {
    throw new ApiError(404, "Job not found or already deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Job deleted successfully!"));
});

// ── Admin Jobs ────────────────────────────────────────────────────────────────
const adminJobs = asyncHandler(async (req, res) => {
  // ✅ Was: req.user._id — should be req.admin._id (verifyAdminJWT sets req.admin)
  const adminId = req.admin._id;

  const jobs = await Job.find({ recruiter: adminId }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Fetched all admin jobs!"));
});

// ── Get All Jobs ──────────────────────────────────────────────────────────────
const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });

  if (!jobs.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No jobs found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Fetched all jobs successfully!"));
});

// ── Get Job Detail ────────────────────────────────────────────────────────────
const getJobDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Job ID is required");
  }

  const jobDetails = await Job.findById(id);

  if (!jobDetails) {
    throw new ApiError(404, "Job not found"); // ✅ use throw, not return ApiError
  }

  return res
    .status(200)
    .json(new ApiResponse(200, jobDetails, "Job details fetched successfully!"));
});

// ── Update Job ────────────────────────────────────────────────────────────────
const updateJobDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Job ID is required");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedJob) {
    throw new ApiError(404, "Job not found"); // ✅ use throw, not return ApiError
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedJob, "Job details updated successfully!"));
});

export {
  postJob,
  updateJobDetails,
  deleteJob,
  getAllJobs,
  getJobDetail,
  adminJobs,
};