function verifyGithubToken(req, res, next) {

    const header = req.header('Authorization');

    if (!header) return res.status(401).json({ error: 'Access denied' });

    const token = header.split(" ")[1];
    
    try {
        throw new Error('github token verify not implemented');
        next();
    } catch (error) {
        console.log('Invalid github token');
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyGithubToken;