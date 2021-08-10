import db from "../db/index";
import validate from "../../helper/validation";

class Loan {
  /** *
   * @param{req} object
   * @param{res} object
   */
  static async postLoan(req, res) {
    const { error } = validate.loanInput(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    try {
      const amount = parseFloat(req.body.amount);
      const tenor = parseFloat(req.body.tenor);
      const interest = 0.05 * amount;
      const paymentInstallment = (amount + interest) / tenor;
      const { email } = req.user;

      const loanQuery = `INSERT INTO 
    loan(users, createdOn, status, repaid, tenor, amount, paymentInstallment, balance, interest) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    returning *`;

      const values = [
        email,
        new Date(),
        "pending",
        false,
        tenor,
        amount,
        paymentInstallment,
        amount + interest,
        interest,
      ];

      const { rows } = await db.query(loanQuery, values);
      return res.status(201).json({
        data: [
          {
            message: "your loan request has been received, wait for approval",
            rows,
          },
        ],
      });
    } catch (err) {
      return res.status(400).json({
        error: "Something went wrong, try again",
      });
    }
  }

  /** *
   * loan history
   * @param{req}object
   * @param{res}object
   */
  static async loanHistory(req, res) {
    const queryString = `SELECT * FROM loan WHERE users = '${req.user.email}'`;
    try {
      const { rows } = await db.query(queryString);
      if (!rows[0]) {
        return res.status(404).json({
          error: "Not Found",
        });
      }

      if (req.user.email === rows[0].users || req.user.isAdmin === true) {
        return res.status(200).json({
          data: [
            {
              message: "loan history retrieval was success",
              rows,
            },
          ],
        });
      }
      return res.status(400).json({
        error: "Hmmm...you do not have access",
      });
    } catch (error) {
      return res.status(400).json({
        error: "Something went wrong, try again",
      });
    }
  }

  /** *
   * loan repayment history
   * @param{req}object
   * @param{res}object
   */
  static async repaymentHistory(req, res) {
    const queryString = "SELECT * FROM loanrepayment WHERE loanid = $1";
    try {
      const { rows } = await db.query(queryString, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({
          error: "Not Found",
        });
      }

      if (req.user.email === rows[0].email || req.user.isAdmin === true) {
        return res.status(200).json({
          data: [
            {
              message: "loan repayments retrieval successful",
              rows,
            },
          ],
        });
      }
      return res.status(400).json({
        error: "Hmmm...you do not have access",
      });
    } catch (error) {
      return res.status(400).json({
        error: "Something went wrong, try again",
      });
    }
  }
}

export default Loan;
