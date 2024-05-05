require('dotenv').config();
const axios = require('axios');
const queryString = require('query-string');
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require('../constants.js');
const LOCAL_HOST = process.env.LOCAL_HOST || 'localhost';

const getAccessTokenFromCode = async (code) => {
    const { data } = await axios({
        url: 'https://github.com/login/oauth/access_token',
        method: 'get',
        params: {
            client_id: process.env.GITHUB_CLIENT_ID || GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET || GITHUB_CLIENT_SECRET,
            redirect_uri: 'http://' + LOCAL_HOST + ':4200',
            code,
        },
    });
    /**
     * GitHub returns data as a string we must parse.
     */
    const parsedData = queryString.parse(data);

    console.log(parsedData); // { token_type, access_token, error, error_description }

    if (parsedData.error) throw new Error(parsedData.error_description)

    return parsedData.access_token;
};

module.exports = getAccessTokenFromCode;