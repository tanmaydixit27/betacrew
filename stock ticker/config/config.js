require('dotenv').config();

module.exports = {
    SERVER_HOST: process.env.SERVER_HOST || 'localhost',
    SERVER_PORT: process.env.SERVER_PORT || 3000,
};
