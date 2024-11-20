const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger");
const createError = require("http-errors");
const { JWT_SECRET } = require('../config/env')

exports.register = async ({ name, email, password, role }) => {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError(400, "User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    logger.info(`User registered: ${email}`);
    return { id: newUser._id, email: newUser.email, role: newUser.role };
};

// Service for user login
exports.login = async ({ email, password }) => {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw createError(401, "Invalid email or password");
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createError(401, "Invalid email or password");
    }

    // Generate a JWT
    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
    );

    logger.info(`User logged in: ${user._id}`);
    return { token };
};
