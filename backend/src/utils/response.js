// utils/response.js

/**
 * Standard API Response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {Boolean} success - success or failure
 * @param {String} message - response message
 * @param {Object} data - optional data
 */
const sendResponse = (res, statusCode, success, message, data = {}) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
};

/**
 * Success Response
 * @param {Object} res 
 * @param {String} message 
 * @param {Object} data 
 * @param {Number} statusCode 
 */
const successResponse = (res, message, data = {}, statusCode = 200) => {
    return sendResponse(res, statusCode, true, message, data);
};

/**
 * Error Response
 * @param {Object} res 
 * @param {String} message 
 * @param {Number} statusCode 
 * @param {Object} errors 
 */
const errorResponse = (res, message, errors = {}, statusCode = 500) => {
    return sendResponse(res, statusCode, false, message, errors);
};

module.exports = {
    sendResponse,
    successResponse,
    errorResponse
};
