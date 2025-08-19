const logger=require('../utils/logger'); // Import the logger utility

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);

    res.status(err.status || 500).json({
        message:err.message || 'Internal Server Error',
    })
}
module.exports = errorHandler;