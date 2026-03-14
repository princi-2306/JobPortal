import { Router } from "express";
import {
    postJob,
    updateJobDetails,
    deleteJob,
    getAllJobs,
    getJobDetail,
    adminJobs
} from "../controllers/job.controller.js"
import { verifyAdminJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/post-job").post(verifyAdminJWT, postJob);
router.route("/update-job/:id").patch(verifyAdminJWT, updateJobDetails);
router.route("/delete-job").delete(verifyAdminJWT, deleteJob);
router.route("/jobs").get(getAllJobs);
router.route("/jobs/:id").get(getJobDetail);
router.route("/admin").get(verifyAdminJWT, adminJobs);

export default router;