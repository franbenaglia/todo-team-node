require('dotenv').config();
const axios = require('axios');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../constants.js');
const LOCAL_HOST = process.env.LOCAL_HOST || 'localhost';

const getAccessTokenFromCode = async (code) => {
    const { data } = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET || GOOGLE_CLIENT_SECRET,
            redirect_uri: 'http://' + LOCAL_HOST + ':4200',
            grant_type: 'authorization_code',
            code,
        },
    });
    console.log('access_token: ' + data.access_token); // { access_token, expires_in, token_type, refresh_token }
    console.log('refresh_token: ' + data.refresh_token);
    return { access_token: data.access_token, refresh_token: data.refresh_token, expires: data.expires_in };
};

const getAccessTokenFromRefreshToken = async (refreshToken) => {
    const { data } = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET || GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            code,
        },
    });
    console.log('access_token: ' + data.access_token);
    console.log('refresh_token: ' + data.refresh_token);
    return { access_token: data.access_token, refresh_token: data.refresh_token, expires: data.expires_in };
};

module.exports = { getAccessTokenFromCode, getAccessTokenFromRefreshToken };