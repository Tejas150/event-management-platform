const app = require('./app')
const connectDB = require('./config/db');

const startApp = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
        });

    } catch (error) {
        logger.error(`Application failed to start: ${error.message}`);
        process.exit(1);
    }
};

startApp();