// authentication:
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

// Authentication middleware:
const auth = async function(req, res, next) {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(400).send({ status: false, message: "Token is required" });
        }
        
        // Split the token to remove the "Bearer" prefix
        const finalToken = token.split(' ');
        const newToken = finalToken[1];

        jwt.verify(newToken, process.env.SECRET_KEY, function(error, decodedToken) {
            if (error) {
                // Check for token expiration
                if (error instanceof jwt.TokenExpiredError) {
                    return res.status(400).send({ status: false, message: "Token expired, Please login again" });
                }
                // Handle other errors
                return res.status(400).send({ status: false, message: "Invalid token" });
            } else {
                req.decodedToken = decodedToken;
                // Proceed to the next middleware or route handler
                next();
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// Permission middleware:
// A wrapper function that takes a role as an argument and returns a middleware function
// This allows us to check if the authenticated user has the required role
const permission = function(role) {
    return (req, res, next) => {
        if (req.decodedToken.role !== role) {
            return res.status(403).send({ status: false, message: "You do not have permission to perform this action" });
        }
        next();
    };
}

module.exports = {auth,permission};