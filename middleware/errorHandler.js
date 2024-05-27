// errorHandler.js

function errorHandler(err, req, res, next) {
    // Handle the error here
    // You can log the error, send a custom error response, etc.

    // Example: Log the error
    console.error(err);

    // Example: Send a custom error response
    // res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;