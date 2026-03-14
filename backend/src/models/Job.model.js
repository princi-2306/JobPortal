import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    jobPlace: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    jobType: {
      type: String,
    },
    jobLevel: {
      type: String,
      enum: ["senior", "mid", "fresher"],
    },
    jobDescription: {
      type: String,
    },
    requirements: [
      {
        type: String,
      },
    ],

    responsibilities: [
      {
        type: String,
      },
    ],

    benefits: [
      {
        type: String,
      },
    ],

    requiredSkills: [
      {
        type: String,
      },
    ],
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export const Job = mongoose.model("Job", jobSchema); 