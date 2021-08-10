import express from "express";
import userController from "../controller/user";
import Auth from "../middleware/Auth";
import pw from "../controller/passwordreset";

const router = express.Router();

// user sign up route
router.post("/signup", userController.createUser);

// user can sign up route
router.post("/signin", userController.loginUser);

// get all users route
router.get("/user", Auth.verifyToken, userController.getUsers);

// get a single user route
router.get("/user/:id", Auth.verifyToken, userController.getUser);

// patch user route
router.patch("/user", Auth.verifyToken, userController.patchUser);

// delete user route
router.delete("/user/:id", Auth.verifyToken, userController.deleteUser);

// password reset route
router.post("/user/sendmail", pw.mailer);

// password reset route
router.post("/user/passwordreset", Auth.verifyToken, pw.resetPassword);

module.exports = router;
