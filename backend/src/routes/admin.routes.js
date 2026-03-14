import { Router } from "express";
import {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetials,
    getCurrentAdmin
} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyAdminJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register-admin").post(upload.none(), registerAdmin); 

router.route("/login-admin").post(loginAdmin);
router.route("/logout-admin").post(verifyAdminJWT, logoutAdmin);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-admin").get(verifyAdminJWT, getCurrentAdmin);
router.route("/change-password").patch(verifyAdminJWT, changeCurrentPassword);
router.route("/update-details").patch(verifyAdminJWT, updateAccountDetials);

export default router;