const express = require("express");
const { validateLogin, validateRegister, errors } = require("../middlewares/validateRequest");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

// Attach Celebrate error handler
router.use(errors());

module.exports = router;
