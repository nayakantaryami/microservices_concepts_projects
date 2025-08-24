const Joi = require("joi"); // Import Joi for validation


const validateCreatePosts = (data) => {
  const Schema = Joi.object({
    content: Joi.string().min(3).max(30).required(),
   
  });
  return Schema.validate(data);
};


module.exports = {
  validateCreatePosts,
};
