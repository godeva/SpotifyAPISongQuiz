var path = require('path'),
    config;

config = {
    production: {
        redirect_uri: 'https://final-hzhang3atwpi.herokuapp.com/',
        // redirect_uri: 'http://localhost:3000/callback',
        client_id: 'f067d80090d34e11b883b81236ad9316',
        client_secret: '31786c2f0ef644fcaf91f15b0a1078d6',
        server: {
            host: 'https://final-hzhang3atwpi.herokuapp.com/',
            port: '5000'
            // port: '3000'
        }
    },
    development: {
      redirect_uri: 'https://final-hzhang3atwpi.herokuapp.com/callback',
        // redirect_uri: 'http://localhost:3000/callback',
        client_id: 'f067d80090d34e11b883b81236ad9316',
        client_secret: '31786c2f0ef644fcaf91f15b0a1078d6',
        server: {
            host: 'https://final-hzhang3atwpi.herokuapp.com/',
            port: '5000'
            // port: '3000'
        }
    }
};

module.exports = config;
