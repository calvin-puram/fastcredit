/* eslint-disable no-unused-vars */
import { expect } from "chai";
import validate from "../helper/validation";

const login = {
  email: "testingapp@gmail.com",
  password: "Kazeem27",
};

const user = {
  email: "testingapp@gmail.com",
  firstName: "tester",
  lastName: "testing",
  password: "Kazeem27",
  address: "27, tunji Olaiya street",
};

const patch = {
  firstName: "tester",
  lastName: "testing",
  password: "Kazeem27",
  address: "27, tunji Olaiya street",
};

describe("validation", () => {
  let result;
  it("Should validate user", () => {
    result = validate.userVerification(user);
    expect(result).to.be.a("object");
  });
  it("Should validate login", () => {
    result = validate.loginInput(login);
    expect(result).to.be.a("object");
  });
  it("Should successfully validate patch user", () => {
    result = validate.patchInput(patch);
    expect(result).to.be.a("object");
  });
  it("Should successfully validate user loan", () => {
    result = validate.loanInput({ amount: 2000.567, tenor: 3 });
    expect(result).to.be.a("object");
  });
  it("Should successfully validate admin verification endpoint", () => {
    result = validate.userVerification({ status: "verified" });
    expect(result).to.be.a("object");
  });
  it("Should successfully validate admin approve loan endpoint", () => {
    result = validate.loanApprovalInput({ status: "approved" });
    expect(result).to.be.a("object");
  });
});
