import db from "./db/index";

class RowHelper {
  /**
   * check if user have a pending loan
   * @param {*} req
   * @param {*} res
   */
  static async checkLoan(req, res, next) {
    try {
      // find if a user have an unpaid loan
      const text = "SELECT * FROM loan WHERE users = $1";
      // Select all user record where id is equal db id
      const { rows } = await db.query(text, [req.user.email]);
      // check if user exist in database
      if (rows[0]) {
        if (rows[0].repaid === false) {
          return res.status(402).json({
            status: 402,
            error: "you have an outstanding loan",
          });
        }
      }
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: "something went wrong, please try again",
      });
    }
    return next();
  }
}

export default RowHelper;
