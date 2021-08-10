import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  // eslint-disable-next-line no-console
  console.log("connected to the db");
});

const createTables = () => {
  const Users = `CREATE TABLE IF NOT EXISTS
  users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR (128) NOT NULL,
    lastName VARCHAR(128) NOT NULL,
    address TEXT NOT NULL,
    email VARCHAR (355) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    status VARCHAR(128) NOT NULL,
    createdOn TIMESTAMP DEFAULT Now(),
    modifiedOn TIMESTAMP NOT NULL,
    isAdmin BOOLEAN NOT NULL
   )`;
  pool.query(Users).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    pool.end();
  });
  const Loan = `CREATE TABLE IF NOT EXISTS
    loan (
        id SERIAL PRIMARY KEY,
        users VARCHAR (355) NOT NULL,
        createdOn TIMESTAMP DEFAULT Now(),
        status VARCHAR(128) NOT NULL,
        repaid BOOLEAN NOT NULL,
        tenor INT NOT NULL,
        amount FLOAT(4) NOT NULL,
        paymentInstallment FLOAT(4) NOT NULL,
        balance FLOAT(4) NOT NULL,
        interest FLOAT(4) NOT NULL
    )`;
  pool.query(Loan).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    pool.end();
  });
  const loanRepayment = `CREATE TABLE IF NOT EXISTS
    loanRepayment (
          id SERIAL PRIMARY KEY,
          loanId SERIAL NOT NULL,
          email VARCHAR (355) NOT NULL,
          createdOn TIMESTAMP DEFAULT Now(),
          amount FLOAT(4) NOT NULL,
          monthlyInstallment FLOAT(4) NOT NULL,
          paidAmount FLOAT(4) NOT NULL,
          balance FLOAT(4) NOT NULL
      )`;
  pool.query(loanRepayment).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    pool.end();
  });

  const alterLoan = `ALTER TABLE loan
      ADD CONSTRAINT fk_loan_users FOREIGN KEY (users) REFERENCES users(email) ON DELETE CASCADE`;
  pool.query(alterLoan).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    pool.end();
  });

  const alterLoanRepayment = `ALTER TABLE loanRepayment
      ADD CONSTRAINT fk_loanRepayment_loan FOREIGN KEY (loanId) REFERENCES loan(id) ON DELETE CASCADE`;
  pool.query(alterLoanRepayment).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    pool.end();
  });
};

pool.on("remove", () => {
  // eslint-disable-next-line no-console
  console.log("client removed");
  process.exit(0);
});

module.exports = createTables;

require("make-runnable");
