const express = require('express');
const router = express.Router();

const {

    getAuthCode,
    getToken,
    getGoogleUserInfo,
    getTokenFromRefreshToken

} = require('../controllers/oauth2google.js');

router.get('/url', getAuthCode);

router.get('/callback', getToken);

router.get('/refresh', getTokenFromRefreshToken);

router.get('/fullUser', getGoogleUserInfo)

module.exports = router;