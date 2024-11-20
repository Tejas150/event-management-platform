const { sendSuccess } = require("../utils/apiResponse");
const { register, login } = require("../services/authService");

exports.registerUser = async (req, res, next) => {
	try {
		const user = await register(req.body);
		sendSuccess(res, "User registered successfully", user);
	} catch (error) {
		next(error);
	}
};

exports.loginUser = async (req, res, next) => {
	try {
		const token = await login(req.body);
		sendSuccess(res, "Login successful", token);
	} catch (error) {
		next(error);
	}
};
