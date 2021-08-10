import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
let connectionString;

if (process.env.NODE_ENV === "test") {
  connectionString = process.env.TEST;
}
if (process.env.NODE_ENV === "production") {
  connectionString = process.env.DATABASE_URL;
}
// Instantiate pool
const pool = new Pool({
  connectionString,
});

class Db {
  /**
   * query() queries database
   *
   * @param {string} queryString
   * @param {*} params
   */
  static async query(queryString, params) {
    return new Promise((resolve, reject) => {
      pool
        .query(queryString, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default Db;
