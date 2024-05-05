
const jwt = require('jsonwebtoken');
const {SECRET_KEY}= require('./constants.js');
const verifyGoogleToken = require('./filterOauth2Google.js');

function verifyToken(req, res, next) {

    const header = req.header('Authorization');

    if (!header) return res.status(401).json({ error: 'Access denied' });

    const token = header.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log('Invalid jwt token');
        verifyGoogleToken(req, res, next);
    }
};

module.exports = verifyToken;