import db from "../db/index";
import validate from "../../helper/validation";
import Helper from "../../helper/helper";
import Auth from "../middleware/Auth";

class User {
  /**
   * signup a user in to the app
   * @param {*} req
   * @param {*} res
   */
  static async createUser(req, res) {
    const { error } = validate.userInput(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const hashpassword = Helper.hashPassword(req.body.password);

    const text = `INSERT INTO 
      users(email, firstName, lastName, address, password, status, isAdmin, createdOn, modifiedOn) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      returning id, email, firstName, lastName, address, status, isAdmin, createdOn, modifiedOn`;
    const values = [
      req.body.email,
      req.body.firstName,
      req.body.lastName,
      req.body.address,
      hashpassword,
      "pending",
      false,
      new Date(),
      new Date(),
    ];
    try {
      const { rows } = await db.query(text, values);
      const token = Auth.generateToken(
        rows[0].id,
        rows[0].email,
        rows[0].isAdmin
      );

      return res.status(201).json({
        token,
        data: rows[0],
      });
    } catch (errors) {
      if (errors.routine === "_bt_check_unique") {
        return res.status(409).json({
          error: "User already exist",
        });
      }
      return res.status(400).json({
        error: "Something went wrong, try again",
      });
    }
  }

  /**
   * log a user in to the app
   * @param {*} req
   * @param {*} res
   */
  static async loginUser(req, res) {
    const { error } = validate.loginInput(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const queryString = "SELECT * FROM users WHERE email = $1";

    try {
      // Select all user record where email is equal db email
      const { rows } = await db.query(queryString, [req.body.email]);

      // check if user exist in database
      if (!rows[0]) {
        return res.status(404).json({
          error: "User not Found",
        });
      }

      // compare user provided password against db
      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(401).json({
          error: "Email/Password incorrect",
        });
      }

      // generate token
      const token = Auth.generateToken(
        rows[0].id,
        rows[0].email,
        rows[0].isadmin
      );

      // return success message
      return res.status(200).json({
        data: [
          {
            message: "Logged in successfully",
            token,
          },
        ],
      });
    } catch (errors) {
      return res.status(400).json({
        error: "Something went wrong, try again",
      });
    }
  }

  /**
   * GET all user
   * @param {*} req
   * @param {*} res
   */
  static async getUsers(req, res) {
    // check for admin user
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: "Unauthorized!, Admin only route",
      });
    }
    const findAllQuery = `SELECT id, firstName, lastName, address, email, 
    status, createdOn, isAdmin FROM users`;
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).json({
        data: [
          {
            message: "users retrieve successfully",
            rows,
            rowCount,
          },
        ],
      });
    } catch (error) {
      return res.status(400).json({
        error: "Something went wrong, try again",
      });
    }
  }

  /**
   * GET A user
   * @param {*} req
   * @param {*} res
   */
  static async getUser(req, res) {
    const findAQuery = `SELECT id, firstName, lastName, address, email, 
    status, createdOn, isAdmin FROM users WHERE id = $1`;
    try {
      const { rows } = await db.query(findAQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({
          error: "Not Found",
        });
      }
      if (req.user.id === rows[0].id || req.user.isAdmin === true) {
        return res.status(200).json({
          data: [
            {
              message: `users with id:${rows[0].id} retrieve successfully`,
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

  /**
   * PATCH A user
   * @param {*} req
   * @param {*} res
   */
  static async patchUser(req, res) {
    const { error } = validate.patchInput(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const updateQuery = `UPDATE users
      SET firstName=$1, lastName=$2, address=$3, modifiedOn=$4
      WHERE id=$5 returning firstName, lastName, address, modifiedOn`;
    try {
      const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.address,
        new Date(),
        req.user.id,
      ];

      const { rows } = await db.query(updateQuery, values);
      return res.status(202).json({
        data: [
          {
            message: `user with id:${rows[0].id} has been updated`,
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

  /**
   * DELETE A user
   * @param {*} req
   * @param {*} res
   */
  static async deleteUser(req, res) {
    // check for admin user
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: "Unauthorized!, Admin only route",
      });
    }
    const deleteQuery = "DELETE FROM users WHERE id=$1 returning *";
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({
          error: "Not Found",
        });
      }
      return res.status(200).json({
        data: [
          {
            message: `users with id:${rows[0].id} has been deleted`,
            rows,
          },
        ],
      });
    } catch (error) {
      return res.status(400).json({
        error: "Something went wrong, try again",
      });
    }
  }
}

export default User;
