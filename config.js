var path = require('path'),
    config;

config = {
    production: {
        redirect_uri: 'http://localhost:8080/callback',
        // redirect_uri: 'http://localhost:3000/callback',
        client_id: 'f067d80090d34e11b883b81236ad9316',
        client_secret: '31786c2f0ef644fcaf91f15b0a1078d6',
        server: {
            host: '127.0.0.1',
            port: '8080'
            // port: '3000'
        }
    },
    development: {
      redirect_uri: 'http://localhost:8080/callback',
        // redirect_uri: 'http://localhost:3000/callback',
        client_id: 'f067d80090d34e11b883b81236ad9316',
        client_secret: '31786c2f0ef644fcaf91f15b0a1078d6',
        server: {
            host: '127.0.0.1',
            port: '8080'
            // port: '3000'
        }
    }
};

module.exports = config;
