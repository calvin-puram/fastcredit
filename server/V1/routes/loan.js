import express from "express";
import loanController from "../controller/loan";
import Auth from "../middleware/Auth";
import rows from "../rowHelper";

const router = express.Router();

// Create a loan application
router.post(
  "/loans",
  Auth.verifyToken,
  rows.checkLoan,
  loanController.postLoan
);

// get all particular loan history
router.get("/loans/history", Auth.verifyToken, loanController.loanHistory);

// View loan repayment history
router.get(
  "/loans/:id/repayments",
  Auth.verifyToken,
  loanController.repaymentHistory
);

module.exports = router;
