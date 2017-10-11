
var express = require('express')
, path = require('path')
, session = require('express-session')
, fs = require('fs')
, qs = require('querystring')
, db = require('sqlite3')
, port = 8080

var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var config = require('./config')[process.env.NODE_ENV || 'development'];

var client_id = config.client_id;
var client_secret = config.client_secret;
var redirect_uri = config.redirect_uri;

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';


// active players
, http = require('http')
, PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
var io = require('socket.io')(server)

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.use(express.static(path.join(__dirname, 'public/static')))

// requests using the socket
io.on('connect', function (socket) {

socket.on('login', function (data) {
  console.log('socket login')
  socket.broadcast.emit('updateList', activeList);
  //socket.emit('activeList', activeList);
});
/*
socket.on('logout', function (data) {
  console.log('socket logout')
  socket.emit('updateList', activeList);
});
*/
app.post('/logIn', function (req, res) {
    var name = req.session.name
    if (name) {
      var pIndex = indexOf (name, playerList) 
      if (pIndex >= 0) {
        var aIndex = indexOf(name, activeList)
        if (aIndex >= 0){
          res.send('already in')
          console.log(name + ' is already logged in')
        } else {
          activeList.push(playerList[pIndex])
          //socket.emit('updateList', activeList);
          res.send('good')
          console.log(name + ' logged in')
          }
      } else {
          res.send('not exist')
          console.log(name + ' does not exist')
      }
    } else {
      res.send('timeout')
      console.log('session timeout, redirect to index')
    }
})
// POST: player logs out
app.post('/logOut', function (req, res) {
    var name = req.session.name
    if (name) {
      var pIndex = indexOf (name, playerList) 
    if (pIndex >= 0) {
        var aIndex = indexOf (name, activeList) 
        if (aIndex >= 0) {
            activeList.splice(aIndex, 1)
            socket.broadcast.emit('updateList', activeList);
            res.send('good')
            console.log(name + ' logged out')
        } else {
            res.send('already out')
            console.log(name + ' is already logged out')
        }
    } else {
      res.send('not exist')
        console.log(name + ' does not exist')
    }
    } else {
      res.send('timeout')
      console.log('session timeout, redirect to index')
    }
})

socket.on('disconnecting', function(reason) {
  socket.broadcast.emit('updateList', activeList);
})

});

// player definition: {name: string, currentScore: int, bestScore: int}

var playerList = []
var activeList = []

app.use(session({
  	secret: 'keyboard meow',
  	resave: false,
  	saveUninitialized: true,
  	cookie: { maxAge: 60000 * 60 * 24 },
  	rolling: true
}))

app.use(express.static(path.join(__dirname, 'public/static')))

app.use(cookieParser());

app.get('/index.html', indexHandler)

app.get('/', indexHandler)

app.get('/lobby.html', lobbyHandler)

app.get('/lobby', lobbyHandler)

app.get('/quiz.html', quizHandler)

app.get('/quiz', function(req, res) {
    res.sendfile(__dirname + '/public/quiz.html');
});

app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

function indexHandler (req, res) {
	if (req.session.name) {
		res.redirect('/lobby')
	} else {
		res.sendFile(path.join(__dirname, 'public/index.html'))
	}
}

function lobbyHandler (req, res) {
	if (!req.session.name) {
		res.redirect('/')
	} else {
		res.sendFile(path.join(__dirname, 'public/lobby.html'))
	}
}

function quizHandler (req, res) {
	if (!req.session.name) {
		res.redirect('/')
	} else {
		res.sendFile(path.join(__dirname, 'public/quiz.html'))
	}
}


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
    if (req.session.name) {
      res.send('session still on')
    } else if (postdata) {
      name = postdata
      // check if username is already used
      var exist = false
      playerList.forEach(function(item, index, array) {
        if (item.name === name) {
          exist = true
          return
        }
      });
      // if not exist
      if (!exist) {
        req.session.name = name
      	playerList.push({name: req.session.name, currentScore: 0, bestScore: 0})
        console.log(name + ' joined')
        res.send('good')
      } else {
        console.log(name + ' already exist')
        res.send('name used')
      }
    } else {
    	console.log('empty name is not accepted')
      res.send('empty name')
    }
  })
})




// GET: send a JSON of playerList
app.get('/playerList', function (req, res) {
  	var content = JSON.stringify(playerList)
  	res.send(content)
})
app.get('/activeList', function (req, res) {
	var content = JSON.stringify(activeList)
  	res.send(content)
})

function indexOf (name, list) {
  var i = -1
  list.forEach(function(item, index, array) {
      if (item.name === name) {
        i = index
        return
      }
  });
  return i;
}
