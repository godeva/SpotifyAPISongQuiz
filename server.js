// my server
var express = require('express')
, path = require('path')
, session = require('express-session')
, fs = require('fs')
, qs = require('querystring')
, port = 8080

var playerList = []

const app = express()

app.use(session({
  secret: 'keyboard meow',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 * 60 * 24 },
  rolling: true
}))

app.use(express.static(path.join(__dirname, 'public')))

// POST: store new player into playerList and store name in session
app.post('/initUsername', function (req, res) {
  var postdata = ''
  req.on('data', function(d) {
    postdata += d
    if (postdata.length > 1e6) { 
      // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      request.connection.destroy();
    }
  })
  req.on('end', function() {
    // session is still on
    if (req.session.username) {
      res.send('on')
      return
    }
    username = postdata
    // check if username already exist
    var exist = false
    playerList.forEach(function(item, index, array) {
      if (item === username) {
        res.send('exist')
        exist = true
        return
      }
    });
    // if not exist
    if (!exist) {
      req.session.username = username
      console.log(username + ' joined')
      res.send('good')
    }
  })
})
// GET: send a JSON of playerList
app.get('/playerList', function (req, res) {
  var content = JSON.stringify(playerList)
  res.send(content)
})
// POST: player logs out
app.post('/logOut', function (req, res) {
  if (req.session.username) {
    var i = -1
    playerList.forEach(function(item, index, array) {
      if (item === username) {
        i = index
        return
      }
    });
    if (i >= 0) {
      playerList.splice(i, 1)
      res.send('good')
      console.log(req.session.username + ' logged out')
    } else {
      // user is already logged out
      res.send('bad')
      console.log(req.session.username + ' log out failed: already logged out')
    }
  } else {
    // username not initialized
    res.send('timeout')
    console.log("log out failed: session timeout")
  }
})
// POST: player logs in
app.post('/logIn', function (req, res) {
  if (req.session.username) {
    var i = -1
    playerList.forEach(function(item, index, array) {
      if (item === username) {
        i = index
        return
      }
    })
    if (i >= 0) {
      res.send('bad')
      console.log(req.session.username + ' log in failed: already logged in')
    } else {
      playerList.push(req.session.username)
      res.send('good')
      console.log(req.session.username + ' logged in')
    }
  } else {
    res.send('timeout')
    console.log('log in failed: no session data')
  }
})

app.listen(process.env.PORT || port)
console.log('listening on ' + port)

// Jackson's server
/*var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8080;

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    case '/':
      sendFile(res, 'public/index.html')
      break
    case '/index.html':
      sendFile(res, 'public/index.html')
      break
    case '/lobby.html':
      sendFile(res, 'public/lobby.html')
      break
    case '/css/style.css':
      sendFile(res, 'public/css/style.css', 'text/css')
      break
    case '/js/scripts.js':
      sendFile(res, 'public/js/scripts.js', 'text/javascript')
      break
    case '/images/bg.jpg':
      sendFile(res, 'public/images/bg.jpg', 'image/jpg')
      break
    case '/images/spot.png':
      sendFile(res, 'public/images/spot.png', 'image/png')
      break
    case '/images/turnt.jpg':
      sendFile(res, 'public/images/turnt.jpg', 'image/jpg')
      break
    case '/images/hot.jpg':
      sendFile(res, 'public/images/hot.jpg', 'image/jpg')
      break
    case '/images/fresh.jpg':
      sendFile(res, 'public/images/fresh.jpg', 'image/jpg')
      break
    case '/images/solid.jpg':
      sendFile(res, 'public/images/solid.jpg', 'image/jpg')
      break
    case '/images/top.jpg':
      sendFile(res, 'public/images/top.jpg', 'image/jpg')
      break
  
      
    default:
      res.end('404 not found')
  }
})

server.listen(process.env.PORT || port);
console.log('listening on 8080')


function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })

}
*/