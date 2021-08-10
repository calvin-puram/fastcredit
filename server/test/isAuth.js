import { expect } from "chai";
import request from "supertest";
import faker from "faker";
import Auth from "../v1/middleware/Auth";
import app from "../app";

let mail;
let userid;

describe("Auth middleware", () => {
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
        expect(res.status).to.be.equal(201);
        expect(body).to.be.an("object");
        expect(body).to.have.property("data");
        expect(res.status).to.a("number");
        expect(res.status).to.be.equal(201);
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
        expect(res.status).to.be.equal(201);
        expect(body).to.be.an("object");
        expect(body).to.have.property("data");
        expect(res.status).to.a("number");
        expect(res.status).to.be.equal(201);
        done();
      });
  });
  it("should throw an error if no authorization header is present", (done) => {
    const token = Auth.generatepwToken(userid, mail);
    expect(token).to.be.a("string");
    done();
  });
});
