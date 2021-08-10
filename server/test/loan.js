import request from "supertest";
import chai from "chai";
import app from "../app";

const { expect } = chai;

let token1;
let token2;
let token3;

// test version one (v1) enpoints

describe("Loan Route version one (v1)", () => {
  it("should signin user and generate token1", (done) => {
    request(app)
      .post("/api/v1/auth/signin")
      .send({
        email: "admin@quickcreditapp.herokuapp.com",
        password: "Kazeem27",
      })
      .end((err, res) => {
        const { body } = res;
        token1 = body.data[0].token;
        done();
      });
  });
  it("should signin user and generate token3", (done) => {
    request(app)
      .post("/api/v1/auth/signin")
      .send({
        email: "kazmobileapp@gmail.com",
        password: "Kazeem27",
      })
      .end((err, res) => {
        const { body } = res;
        token3 = body.data[0].token;
        done();
      });
  });
  it("should signin user and generate token2", (done) => {
    request(app)
      .post("/api/v1/auth/signin")
      .send({
        email: "tobi4real2050@gmail.com",
        password: "Kazeem27",
      })
      .end((err, res) => {
        const { body } = res;
        token2 = body.data[0].token;
        done();
      });
  });
  it("should signin user and generate token3", (done) => {
    request(app)
      .post("/api/v1/auth/signin")
      .send({
        email: "kazmobileapp@gmail.com",
        password: "Kazeem27",
      })
      .end((err, res) => {
        const { body } = res;
        token3 = body.data[0].token;
        done();
      });
  });
  it("should not post a user loan successfully, tenor should be between 1 - 12", (done) => {
    request(app)
      .post("/api/v1/loans")
      .set("token", token2)
      .send({ amount: 2000.567, tenor: 13 })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(400);
        expect(body).to.have.property("error");
        done();
      });
  });
  it("should not post a user loan successfully if user have a pending loan", (done) => {
    request(app)
      .post("/api/v1/loans")
      .set("token", token1)
      .send({ amount: 2000.567, tenor: 3 })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(402);
        expect(body).to.have.property("error");
        expect(body.error).to.be.equal("you have an outstanding loan");
        done();
      });
  });
  it("should retrieve a loan repayment history successfully", (done) => {
    request(app)
      .get("/api/v1/loans/1/repayments")
      .set("token", token3)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(200);
        expect(body).to.have.property("data");
        expect(body.data[0]).to.have.property("message");
        done();
      });
  });
  it("should not retrieve a loan repayment history", (done) => {
    request(app)
      .get("/api/v1/loans/1/repayments")
      .set("token", token2)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(400);
        expect(body).to.have.property("error");
        expect(body.error).to.be.equal("Hmmm...you do not have access");
        done();
      });
  });
  it("should not retrieve a loan repayment history", (done) => {
    request(app)
      .get("/api/v1/loans/499/repayments")
      .set("token", token1)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(404);
        expect(body).to.have.property("error");
        expect(body.error).to.be.equal("Not Found");
        done();
      });
  });
  it("should retrieve a loan history of a user", (done) => {
    request(app)
      .get("/api/v1/loans/history")
      .set("token", token1)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(200);
        expect(body).to.have.property("data");
        expect(body.data[0]).to.haveOwnProperty("message");
        expect(body.data[0].message).to.be.equal(
          "loan history retrieval was success"
        );
        done();
      });
  });
  it("should not retrieve a loan history of a user", (done) => {
    request(app)
      .get("/api/v1/loans/history")
      .set("token", token2)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(404);
        expect(body).to.have.property("error");
        expect(body.error).to.be.equal("Not Found");
        done();
      });
  });
  it("should not retrieve a loan history of a user", (done) => {
    request(app)
      .get("/api/v1/loans/history")
      .set("token", token2)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(404);
        expect(body).to.have.property("error");
        expect(body.error).to.be.equal("Not Found");
        done();
      });
  });
});
