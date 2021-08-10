import express from "express";
import adminController from "../controller/admin";
import Auth from "../middleware/Auth";
import Helper from "../../helper/helper";

const router = express.Router();

// Admin can mark a client as verified route
router.patch(
  "/users/:email/verify",
  Auth.verifyToken,
  adminController.verifyUser
);

// Admin can view all loan route
router.get(
  "/loans",
  Auth.verifyToken,
  adminController.loanPayment,
  adminController.allLoan
);

// Admin can view a loan route
router.get("/loans/:id", Auth.verifyToken, adminController.oneLoan);

// Admin can approve or reject a loan
router.patch(
  "/loans/:id",
  Auth.verifyToken,
  Helper.mailer,
  adminController.approveReject
);

// Admin can create a loan repayment record
router.post(
  "/loans/:id/repayment",
  Auth.verifyToken,
  adminController.loanRepayforClient
);

export default router;
