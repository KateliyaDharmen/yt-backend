import { Router } from "express";
import { registerUser, loginUser, logoutUSer, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

userRouter.route("/login").post(loginUser)

//secure routes
userRouter.route("/logout").post(verifyJWT, logoutUSer)
userRouter.route("/refresh-Token").post(refreshAccessToken)

export default userRouter;