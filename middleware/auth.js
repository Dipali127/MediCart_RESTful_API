//authentication:
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

// Authentication middleware:
const auth = async function(req, res, next) {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(400).send({ status: false, message: "Token is required" });
        }

         // The token might contain the word "Bearer" as a prefix, which needs to be removed.
        //Split the token to remove the "Bearer" prefix
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




//like in permission wrap up function instead of directly used the middleware we will use a wrap up function so that 
//we can use some another argument like role bcoz when we use direct middleware like above then we cant use some
//another parameter bcoz in middleware there are only three parameters i.e req,res and next.
const permission = function(role) {
    return (req, res, next) => {
        if (req.decodedToken.role !== role) {
            return res.status(403).send({ status: false, message: "You do not have permission to perform this action" });
        }
        next();
    };
}

module.exports = {auth,permission};