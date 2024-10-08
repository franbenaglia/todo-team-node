const verifyGithubToken = require('./filterOauth2Github.js');

function verifyGoogleToken(req, res, next) {

    const header = req.header('Authorization');

    if (!header) return res.status(401).json({ error: 'Access denied' });

    const token = header.split(" ")[1];
    
    try {

        //console.log(req);
        //throw new Error('google token verify not implemented');
        //if(req.indexOf('googleapis'))
        next();
    } catch (error) {
        console.log('Invalid google token');
        verifyGithubToken(req, res, next);
    }
};

module.exports = verifyGoogleToken;