// https://medium.com/@jackrobertscott/easy-google-auth-with-node-js-99ac40b97f4c
require('dotenv').config();
const queryString = require('query-string');
const { GOOGLE_CLIENT_ID } = require('../constants.js');
const LOCAL_HOST = process.env.LOCAL_HOST || 'localhost';

const stringifiedParams = queryString.stringify({
  client_id: process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID,
  redirect_uri: 'http://' + LOCAL_HOST + ':4200',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '), // space separated string
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
});

const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

module.exports = googleLoginUrl;