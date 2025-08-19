const Joi = require("joi"); // Import Joi for validation

const validateRegistration = (data) => {
  const Schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return Schema.validate(data);
};

module.exports = {
  validateRegistration
};
