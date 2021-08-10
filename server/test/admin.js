import request from "supertest";
import chai from "chai";
import faker from "faker";
import app from "../app";

const { expect } = chai;

let Token;
let adminToken;
let mail;
// let loanId;
let userid;

describe("Admin Route version one", () => {
  it("should login admin successfully and generate admin token", (done) => {
    request(app)
      .post("/api/v1/auth/signin")
      .send({ email: "admin@quickcreditapp.com", password: "Kazeem27" })
      .end((err, res) => {
        const { body } = res;
        adminToken = body.data[0].token;
        done();
      });
  });
  it("should login user successfully and generate user token", (done) => {
    request(app)
      .post("/api/v1/auth/signin")
      .send({ email: "kazmobileapp@gmail.com", password: "Kazeem27" })
      .end((err, res) => {
        const { body } = res;
        Token = body.data[0].token;
        done();
      });
  });
  it("should successfully signup a user with valid details", (done) => {
    request(app)
      .post("/api/v1/auth/signup")
      .send({
        email: faker.internet.email(),
        firstName: "tester",
        lastName: "testing",
        password: "Kazeem27",
        address: "27, tunji Olaiya street",
      })
      .end((err, res) => {
        const { body } = res;
        mail = body.data.email;
        userid = body.data.id;
        done();
      });
  });
  it("should verified a user successfully", (done) => {
    request(app)
      .patch(`/api/v1/users/${mail}/verify`)
      .set("token", adminToken)
      .send({ status: "verified" })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(200);
        expect(body).to.have.property("data");
        expect(body.data[0]).to.haveOwnProperty("message");
        expect(body.data[0].message).to.be.equal(
          `users with id:${userid} has been verified`
        );
        done();
      });
  });
  it("should not verified a user successfully if not found", (done) => {
    request(app)
      .patch("/api/v1/users/kazmobileap@gmail.com/verify")
      .set("token", adminToken)
      .send({ status: "verified" })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(404);
        expect(body).to.have.property("error");
        expect(body.error).to.be.equal("Not Found");
        done();
      });
  });
  it("should not authorize a user without a token", (done) => {
    request(app)
      .patch(`/api/v1/users/${mail}/verify`)
      .send({ status: "verified" })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(403);
        expect(body).to.have.property("error");
        expect(body.error).to.be.equal("Unauthorized!, you have to login");
        done();
      });
  });
  it("should not authorize a user in admin route", (done) => {
    request(app)
      .patch(`/api/v1/users/${mail}/verify`)
      .set("token", Token)
      .send({ status: "verified" })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(403);
        expect(body).to.have.property("error");
        expect(body.error).to.be.equal("Unauthorized!, Admin only route");
        done();
      });
  });
  it("should not verified a user successfully with wrong input", (done) => {
    request(app)
      .patch(`/api/v1/users/${mail}/verify`)
      .set("token", adminToken)
      .send({ status: "verify" })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(400);
        expect(body).to.have.property("error");
        done();
      });
  });
  it("should post a user loan successfully", (done) => {
    request(app)
      .post("/api/v1/loans")
      .set("token", Token)
      .send({ amount: 2000.567, tenor: 2 })
      .end((err, res) => {
        expect(res.status).to.be.a("number");
        done();
      });
  });
  it("should get all loan application successfully", (done) => {
    request(app)
      .get("/api/v1/loans")
      .set("token", adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(200);
        expect(body).to.have.property("data");
        expect(body.data[0]).to.haveOwnProperty("message");
        expect(body.data[0].message).to.be.equal("loans retrieve successfully");
        done();
      });
  });
  it("should get a specific loan application successfully", (done) => {
    request(app)
      .get("/api/v1/loans/1")
      .set("token", adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(200);
        expect(body).to.have.property("data");
        expect(body.data[0]).to.haveOwnProperty("message");
        done();
      });
  });
  it("should not get a specific loan application successfully", (done) => {
    request(app)
      .get("/api/v1/loans/678954")
      .set("token", adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(404);
        expect(body).to.have.property("error");
        done();
      });
  });
  it("should view current loans (not fully repaid). successfully", (done) => {
    request(app)
      .get("/api/v1/loans?status=approved&repaid=false")
      .set("token", adminToken)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.status).to.be.a("number");
        done();
      });
  });
  it("should view all paid loans successfully", (done) => {
    request(app)
      .get("/api/v1/loans?status=approved&repaid=true")
      .set("token", adminToken)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.status).to.be.a("number");
        done();
      });
  });
  it("should not approve or reject a loan without correct input", (done) => {
    request(app)
      .patch("/api/v1/loans/1")
      .set("token", adminToken)
      .send({ status: "approve" })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(400);
        expect(body).to.have.property("error");
        done();
      });
  });
  it("should not approve a loan  successfully", (done) => {
    request(app)
      .patch("/api/v1/loans/4")
      .set("token", adminToken)
      .send({ status: "approved" })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(400);
        expect(body).to.have.property("error");
        done();
      });
  });
  it("should approve or reject a loan  successfully", (done) => {
    request(app)
      .patch("/api/v1/loans/1")
      .set("token", adminToken)
      .send({ status: "approved" })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(200);
        expect(body).to.have.property("data");
        expect(body.data[0]).to.haveOwnProperty("message");
        done();
      });
  });
  it("should successfully post loan repayment for a client", (done) => {
    request(app)
      .post("/api/v1/loans/1/repayment")
      .send({ paidAmount: 5 })
      .set("token", adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(201);
        expect(body).to.have.property("data");
        done();
      });
  });
  it("should not post loan repayment for a client if repayment is more than loan", (done) => {
    request(app)
      .post("/api/v1/loans/1/repayment")
      .send({ paidAmount: 400000 })
      .set("token", adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(400);
        expect(body).to.have.property("error");
        expect(body.error).to.be.equal("You can not pay more than your debt!");
        done();
      });
  });
  it("should not post loan repayment for a client", (done) => {
    request(app)
      .post("/api/v1/loans/1/repayment")
      .send({})
      .set("token", adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(400);
        expect(body).to.have.property("error");
        done();
      });
  });
  it("should not post loan repayment for a client", (done) => {
    request(app)
      .post("/api/v1/loans/2000/repayment")
      .send({ paidAmount: 1000 })
      .set("token", adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(404);
        expect(body).to.have.property("error");
        expect(body.error).to.be.equal("No such loan found");
        done();
      });
  });
  it("should delete a user successfully", (done) => {
    request(app)
      .delete(`/api/v1/auth/user/${userid}`)
      .set("token", adminToken)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });
});
