import request from "supertest";
import chai from "chai";
import assert from "assert";
import http from "http";
import app from "../app";

const { expect } = chai;

describe("APP js", () => {
  it("should get home successfully", (done) => {
    request(app)
      .get("/")
      .then((res) => {
        expect(res.status).to.be.equal(200);
        done();
      })
      .catch((error) => done(error));
  });
  it("should get home successfully", (done) => {
    request(app)
      .get("/api/v1/home")
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property("error");
        done();
      })
      .catch((error) => done(error));
  });
});

it("should handle internal server error", (done) => {
  request(app)
    .get("/api/v1/loans/%")
    .then((res) => {
      expect(res.status).to.be.equal(500);
      expect(res.body).to.have.property("error");
      expect(res.body.error).to.be.equal("Internal server error");
      done();
    })
    .catch((error) => done(error));
});
it("should handle internal server error", (done) => {
  request(app)
    .get("/api/v1/loans%/")
    .then((res) => {
      expect(res.status).to.be.equal(404);
      expect(res.body).to.have.property("error");
      done();
    })
    .catch((error) => done(error));
});

describe("HTTP Server", () => {
  it("should return 200", (done) => {
    http.get("http://localhost:5500", (res) => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});
