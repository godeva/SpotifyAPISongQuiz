var path = require('path'),
    config;

config = {
    production: {
        redirect_uri: 'http://localhost:5000/',
        client_id: 'f067d80090d34e11b883b81236ad9316',
        client_secret: '31786c2f0ef644fcaf91f15b0a1078d6',
        server: {
            host: '127.0.0.1',
            port: '5000'
        }
    },
    development: {
      redirect_uri: 'http://localhost:5000/callback',
        client_id: 'f067d80090d34e11b883b81236ad9316',
        client_secret: '31786c2f0ef644fcaf91f15b0a1078d6',
        server: {
            host: '127.0.0.1',
            port: '5000'
        }
    }
};

module.exports = config;
