
var request = require('request');

var config = require('./config')[process.env.NODE_ENV || 'development'];
var client_id = config.client_id;
var client_secret = config.client_secret;
var redirect_uri = config.redirect_uri;


var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'client_credentials'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  }


  request.post(authOptions, function(error, response, body){
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      var getOptions = {
          url: 'https://api.spotify.com/v1/tracks/31MkGwj0SWgZaTvEt5Hgxv',
        headers: {
          'Authorization': 'Bearer ' + (access_token)
        },
        json: true
      }
      request.get(getOptions, function(error, response, body){
        if (!error && response.statusCode === 200) {
          console.log(body.name)
          console.log(body.preview_url)
        } else {
          console.log('error getting songs')
        }
      })
    } else {
      console.log('error getting token')
    }
  })