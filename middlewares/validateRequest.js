const { celebrate, Joi, errors } = require("celebrate");

const validateRegister = celebrate({
  body: Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name cannot be empty.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email cannot be empty.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.empty": "Password cannot be empty.",
    }),
    role: Joi.string()
      .valid("attendee", "organizer")
      .optional()
      .messages({
        "any.only": "Role must be either 'attendee' or 'organizer'.",
      }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email cannot be empty.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.empty": "Password cannot be empty.",
    }),
  }),
});

const validateEvent = celebrate({
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
  }),
});

const validateId = celebrate({
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

module.exports = { validateLogin, validateRegister, validateEvent, validateId, errors };
