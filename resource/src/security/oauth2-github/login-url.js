//https://medium.com/@jackrobertscott/easy-github-auth-with-node-js-502d3d8f8e62
require('dotenv').config();
const queryString = require('query-string');
const { GITHUB_CLIENT_ID } = require('../constants.js');
const LOCAL_HOST = process.env.LOCAL_HOST || 'localhost';

const params = queryString.stringify({
  client_id: process.env.GITHUB_CLIENT_ID || GITHUB_CLIENT_ID,
  redirect_uri: 'http://' + LOCAL_HOST + ':4200',
  scope: ['read:user', 'user:email'].join(' '),
  allow_signup: true,
});

const githubLoginUrl = `https://github.com/login/oauth/authorize?${params}`;

module.exports = githubLoginUrl;