require('express-async-errors'); // Handles async errors globally

const express = require('express');
const { PORT, NODE_ENV } = require('./config/env');

const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const authRoute = require('./routes/authRoute');
const eventRoute = require('./routes/eventRoute');

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use('/api/auth', authRoute);
app.use('/api/event', eventRoute);

app.use(errorHandler);

module.exports = app 
