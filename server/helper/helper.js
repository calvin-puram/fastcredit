/* eslint-disable radix */
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import db from "../v1/db/index";

dotenv.config();

const Helper = {
  /**
   * Hash Password Method
   * @param {string} Password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },

  /**
   * compare Password
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  /** *
   * send mail for password reset verification
   * @param {*} req
   * @param {*} res
   */
  async mailer(req, res, next) {
    const requestId = parseInt(req.params.id);
    const queryString = "SELECT * FROM loan WHERE id = $1";
    try {
      const { rows } = await db.query(queryString, [requestId]);
      if (!rows[0]) {
        return res.status(404).json({
          error: "No loan with that email address exists!",
        });
      }

      const findQuery = "SELECT * FROM users WHERE email = $1";
      const myRows = await db.query(findQuery, [rows[0].users]);

      if (myRows.rows[0].status === "pending") {
        return res.status(400).json({
          error: "loan can not be approved, wait for user verification",
        });
      }

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
        to: rows[0].users,
        subject: `Your loan request has been ${req.body.status}`,
        html: `We are pleased to inform you that your loan has just been ${req.body.status}. <a href = "https://quickcreditapp.herokuapp.com/sign-in.html">Login</a>\n\nThank you!`,
      };

      transporter.sendMail(HelperOptions, (error, { accepted }) => {
        if (error) {
          return res.status(400).json({
            error,
          });
        }
        return res.status(200).json({
          accepted,
        });
      });
      return next();
    } catch (err) {
      return res.status(400).json({
        error: "something went wrong",
      });
    }
  },
};

export default Helper;
