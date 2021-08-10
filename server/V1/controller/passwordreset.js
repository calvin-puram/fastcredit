import moment from "moment";
import nodemailer from "nodemailer";
import db from "../db/index";
import validate from "../../helper/validation";
import Helper from "../../helper/helper";
import Auth from "../middleware/Auth";

class PasswordReset {
  /** *
   * send mail
   * @param {*} req
   * @param {*} res
   */
  static async mailer(req, res) {
    const { error } = validate.mailer(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const queryString = "SELECT * FROM users WHERE email = $1";
    try {
      const { rows } = await db.query(queryString, [req.body.email]);
      if (!rows[0]) {
        return res.status(404).json({
          error: "No account with that email address exists!",
        });
      }
      const mail = rows[0].email;
      const token = Auth.generatepwToken(
        rows[0].id,
        rows[0].email,
        rows[0].password
      );

      const url = "https://fastcreditapp.herokuapp.com/reset-password.html";

      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        port: 25,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_SECRET,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const HelperOptions = {
        from: '"Quick Credit" <quickcreditapp@gmail.com',
        to: mail,
        subject: "Forgot your password? We can help. ",
        html: `Hi ${rows[0].firstname} <br><br> Forgot your password? No worries. we have got you covered. Click the link below to reset your password <br><br> <a href = "${url}/${rows[0].id}/${token}">Reset</a>`,
      };

      transporter.sendMail(HelperOptions, (err, { accepted }) => {
        if (err) {
          return res.status(400).json({
            err,
          });
        }
        return res.status(200).json({
          accepted,
        });
      });
    } catch (err) {
      return res.status(400).json({
        error: "hmmm...something went wrong, please try again",
      });
    }
    return "success";
  }

  /** *
   * password reset
   * @param {*} req
   * @param {*} res
   */
  static async resetPassword(req, res) {
    const { error } = validate.password(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const hashpassword = Helper.hashPassword(req.body.password);

    const updateQuery = `UPDATE users
      SET password=$1, modifiedOn=$2
      WHERE email=$3 returning *`;

    const values = [hashpassword, moment(new Date()), req.user.email];

    try {
      if (req.body.password === req.body.passwordConf) {
        const { rows } = await db.query(updateQuery, values);

        return res.status(202).json({
          data: [
            {
              message: "password reset successfully",
              rows,
            },
          ],
        });
      }
      return res.status(400).json({
        error: "Passwords must match",
      });
    } catch (err) {
      return res.status(400).json({
        error: "Hmmm...something went wrong, please try again",
      });
    }
  }
}

export default PasswordReset;
