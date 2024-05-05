const express = require('express');
const router = express.Router();

const {

    getAuthCode,
    getToken,
    getGitHubUserData 

} = require('../controllers/oauth2github.js');

router.get('/url', getAuthCode);

router.get('/callback', getToken); 

router.get('/fullUser', getGitHubUserData); 

module.exports = router;