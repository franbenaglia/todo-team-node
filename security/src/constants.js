require('dotenv').config();
const SECRET_KEY = 'bWljbGF2ZQ==jlkjgyuygtuiygfgccbvjvghccgfxvc';
const PORT = process.env.PORT_SECURITY_SERVER || 8081;

module.exports = {SECRET_KEY, PORT};