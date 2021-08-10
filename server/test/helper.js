import { expect } from "chai";
import Helper from "../helper/helper";

describe("JWT, BYCRYPT", () => {
  let result;
  it("Should return hashed password (string)", () => {
    result = Helper.hashPassword("2begood4");
    expect(result).to.be.a("string");
  });
  it("Should return true if password matches hashed", () => {
    result = Helper.comparePassword(`${result}`, "2begood4");
    expect(result).to.be.equal(true);
  });
  it("Should return false if password does not matches hashed", () => {
    result = Helper.comparePassword(`${result}`, "2begood5");
    expect(result).to.be.equal(false);
  });
});
