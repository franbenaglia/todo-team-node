
const githubLoginUrl = require('../security/oauth2-github/login-url');
const getAccessTokenFromCode = require('../security/oauth2-github/access_token');
const axios = require('axios');

const getAuthCode = (request, response) => {
    response.status(200).json({ authURL: githubLoginUrl }); //would be authGithubURL
};

const getToken = async (request, response) => {

    const { code } = request.query;
    try {
        const tokenAccess = await getAccessTokenFromCode(code);
        response.json({ token: tokenAccess });
         //agregar send aqui genera error de ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent to the client
    } catch (error) {
        console.log(error);
    }

};


const getGitHubUserData = async (req, res) => {

    const header = req.header('Authorization');

    if (!header) return res.status(401).json({ error: 'Access denied' });

    const access_token = header.split(" ")[1];

  const { data } = await axios({
    url: 'https://api.github.com/user',
    method: 'get',
    headers: {
      Authorization: `token ${access_token}`,
    },
  });
  console.log(data); 

  res.json({ name: data.login, username: data.login, role: 'ADMINISTRATOR' }); 
};

module.exports = { getAuthCode, getToken, getGitHubUserData };