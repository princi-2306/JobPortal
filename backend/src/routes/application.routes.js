import { Router } from "express"
import {
    getAllAdminApplications,
    getAllJobsApplied,
    getApplicationCount,
    getApplicationDetails,
    createApplication
} from "../controllers/application.controller.js"
import { verifyAdminJWT, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/admin-applications").get(verifyAdminJWT, getAllAdminApplications);
router.route("/applied-jobs").get(verifyJWT, getAllJobsApplied);
router.route("/applications-count/:id").get(verifyAdminJWT, getApplicationCount);
router.route("/get-application/:applicationId").get(getApplicationDetails);
router.route("/create-application/:jobId").post(verifyJWT,
    upload.fields([
            {
                name:"resume",
                maxCount: 1
            }
    ]),
    createApplication);

export default router;