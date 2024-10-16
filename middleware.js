// middleware.js
const { jwtKey } = require("./jwtConfig");
const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // The token is expected to be in the format "Bearer <token>"
        const token = authHeader.split(' ')[1];

        jwt.verify(token, jwtKey, (err, user) => {
            if (err) {
                return res.status(403).json({ msg: 'Token verification failed' });
            }
            req.user = user; // Optional: Attach user info to request object
            next();
        });
    } else {
        res.status(401).json({ msg: 'Authorization header missing' });
    }
}

module.exports = {
    authenticateJWT,
};
