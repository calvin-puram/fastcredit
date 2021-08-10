import Joi from "joi";

class Validation {
  /**
   * funtion to validate user's registration details
   * @param {user} object
   */
  static userInput(user) {
    const schema = Joi.object().keys({
      email: Joi.string().email().trim().required(),
      firstName: Joi.string()
        .trim()
        .strict()
        .regex(/^[a-zA-Z]+$/)
        .required()
        .error(() => "first name is required with only alphabet"),
      lastName: Joi.string()
        .trim()
        .strict()
        .regex(/^[a-zA-Z]+$/)
        .required()
        .error(() => "last name is required with only alphabet"),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .trim()
        .strict()
        .required()
        .error(() => "you must provide a correct password"),
      address: Joi.string().trim().strict().required(),
    });
    return Joi.validate(user, schema);
  }

  /**  funtion to validate login inputs
   * @param{details} string
   */
  static loginInput(details) {
    const schema = Joi.object().keys({
      email: Joi.string().email().trim().required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .trim()
        .strict()
        .required()
        .error(() => "you must provide a correct password"),
    });
    return Joi.validate(details, schema);
  }

  /**
   * validate patch user input
   * @param {user} object
   */
  static patchInput(user) {
    const schema = Joi.object().keys({
      firstName: Joi.string()
        .trim()
        .strict()
        .regex(/^[a-zA-Z]+$/)
        .required()
        .error(() => "first name is required with only alphabet"),
      lastName: Joi.string()
        .trim()
        .strict()
        .regex(/^[a-zA-Z]+$/)
        .required()
        .error(() => "last name is required with only alphabet"),
      address: Joi.string().trim().strict().required(),
    });
    return Joi.validate(user, schema);
  }

  /**
   * validate loan application input
   * @param {loan} object
   */
  static loanInput(loan) {
    const schema = Joi.object().keys({
      tenor: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .required()
        .error(() => "tenor must be in between 1 and 12"),
      amount: Joi.number()
        .min(500)
        .max(96547839593)
        .required()
        .error(() => "amount can not be lesser than 500"),
    });
    return Joi.validate(loan, schema);
  }

  /**
   * validate user verification
   * @param {user} object
   */
  static userVerification(status) {
    const schema = Joi.object().keys({
      status: Joi.string()
        .trim()
        .strict()
        .insensitive()
        .valid("unverified", "verified")
        .required(),
    });
    return Joi.validate(status, schema);
  }

  /**
   * validate loan approval input
   * @param {user} object
   */
  static loanApprovalInput(loan) {
    const schema = Joi.object().keys({
      status: Joi.string()
        .trim()
        .strict()
        .insensitive()
        .valid("approved", "rejected")
        .required()
        .error(() => "input the right word"),
    });
    return Joi.validate(loan, schema);
  }

  /**
   * validate loan repayment inputs
   * @param {user} object
   */
  static loanRepaymentInput(loan) {
    const schema = Joi.object().keys({
      paidAmount: Joi.number().min(1).required(),
    });
    return Joi.validate(loan, schema);
  }

  /**
   * validate email for password reset
   * @param {email} object
   */
  static mailer(email) {
    const schema = Joi.object().keys({
      email: Joi.string()
        .email()
        .trim()
        .required()
        .error(() => "invalid email"),
    });
    return Joi.validate(email, schema);
  }

  /**
   * validate password
   * @param {user} object
   */
  static password(passDetails) {
    const schema = Joi.object().keys({
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .trim()
        .strict()
        .required()
        .error(() => "incorrect password"),
      // password must be a valid string and is required
      passwordConf: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .trim()
        .strict()
        .required()
        .error(() => "incorrect password"),
    });
    return Joi.validate(passDetails, schema);
  }
}

export default Validation;
