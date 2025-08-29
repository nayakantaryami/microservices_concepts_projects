const Joi = require("joi"); // Import Joi for validation


const validateCreatePosts = (data) => {
  const Schema = Joi.object({
    content: Joi.string().min(3).max(100).required(),
    mediaIds:Joi.array()
   
  });
  return Schema.validate(data);
};


module.exports = {
  validateCreatePosts,
};
