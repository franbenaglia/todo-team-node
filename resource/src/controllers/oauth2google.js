
const googleLoginUrl = require('../security/oauth2-google/login-url');
const {getAccessTokenFromCode, getAccessTokenFromRefreshToken} = require('../security/oauth2-google/access_token');
const axios = require('axios');

const getAuthCode = (request, response) => {
    response.status(200).json({ authURL: googleLoginUrl });
};

const getToken = async (request, response) => {

    const { code } = request.query;
    try {
        const {access_token, refresh_token, expires} = await getAccessTokenFromCode(code);
        response.json({ token: access_token, refresh_token: refresh_token, expires: expires });
        //agregar send aqui genera error de ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent to the client
    } catch (error) {
        console.log(error);
    }

};

const getTokenFromRefreshToken = async (request, response) => {

    const { refreshToken } = request.query;
    try {
        const {access_token, refresh_token, expires} = await getAccessTokenFromRefreshToken(refreshToken);
        response.json({ token: access_token, refresh_token: refresh_token, expires: expires });
        //agregar send aqui genera error de ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent to the client
    } catch (error) {
        console.log(error);
    }

};

const getGoogleUserInfo = async (req, res) => {

    const header = req.header('Authorization');

    if (!header) return res.status(401).json({ error: 'Access denied' });

    const access_token = header.split(" ")[1];

    const { data } = await axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    console.log(data);

    res.json({ name: data.email, username: data.name, role: 'ADMINISTRATOR' }); 

};



module.exports = { getAuthCode, getToken, getGoogleUserInfo, getTokenFromRefreshToken };