
var express = require('express')
, path = require('path')
, session = require('express-session')
, fs = require('fs')
, qs = require('querystring')
, sqlite3 = require('sqlite3')
, http = require('http')
, PORT = process.env.PORT || 5000

var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var config = require('./config')[process.env.NODE_ENV || 'development'];

var client_id = config.client_id;
var client_secret = config.client_secret;
var redirect_uri = config.redirect_uri;

//set up database
var db = new sqlite3.Database('matchdata.sqlite');
db.serialize(function() {
  // making the table
  db.run("DROP TABLE IF EXISTS leaderboard;")
  db.run("CREATE TABLE leaderboard (player varchar(100), score integer, playlist integer);");

  // adding data
  db.run("INSERT INTO leaderboard VALUES ('Ryan', 10, 6)");
  db.run("INSERT INTO leaderboard VALUES ('Jackson', 5, 6)");
  db.run("INSERT INTO leaderboard VALUES ('Connor', 4, 6)");

  // querying data
  db.each("SELECT player, score, playlist FROM leaderboard", function(err, row) {
      console.log(row.player + " : " + row.score + " : " + row.playlist);
  });


});

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';

const app = express()
const server = http.createServer(app)
server.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.use(express.static(path.join(__dirname, 'public/static')))

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


var io = require('socket.io')(server)
io.on('connect', function (socket) {
  socket.on('getList', function(data) {
    socket.emit('updateList', activeList);
  })
  socket.on('sendChat', function(data) {
    io.local.emit('newChat', data)
  })
})

app.post('/logIn', function (req, res) {
    var name = req.session.name
    if (name) {
      var pIndex = indexOf (name, playerList)
      if (pIndex >= 0) {
        var aIndex = indexOf(name, activeList)
        if (aIndex >= 0){
          res.send(name)
          console.log(name + ' is already logged in')
        } else {
          activeList.push(playerList[pIndex])
          io.local.emit('updateList', activeList)
          res.send(name)
          console.log(name + ' logged in')
          }
      } else {
          res.send('bad')
          console.log(name + ' does not exist')
      }
    } else {
      res.send('bad')
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
            io.local.emit('updateList', activeList)
            res.send('good')
            console.log(name + ' logged out')
        } else {
            res.send('bad')
            console.log(name + ' is already logged out')
        }
    } else {
      res.send('bad')
        console.log(name + ' does not exist')
    }
    } else {
      res.send('bad')
      console.log('session timeout, redirect to index')
    }
})

app.use(express.static(path.join(__dirname, 'public/static')))

app.use(cookieParser());

app.get('/index.html', indexHandler)

app.get('/', indexHandler)

app.get('/lobby.html', lobbyHandler)

app.get('/lobby', lobbyHandler)

app.get('/quiz.html', quizHandler)

app.get('/quiz', quizHandler)

app.get('/leaderboard.html', leaderboardHandler)
app.get('/leaderboard', leaderboardHandler)

app.get('/leaders', leadersGet)

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

function leaderboardHandler (req, res) {
  res.sendFile(path.join(__dirname, 'public/leaderboard.html'))
}

function leadersGet(req, res) {
  console.log("leaders get");
  var output_players = []
  db.each("SELECT player, score FROM leaderboard", function(err, row) {
          //console.log("selecting: " + row.title + " : " + row.rating)
          output = row.player; // + ": " + row.rating;
          output_players.push(output)
      }, function() {
        console.log(output_players)
        callbackSend(res, output_players);
      });
}


function callbackSend(res, output_players) {
  res.writeHead(200, {'Content-type': 'application/json'})
  var output = JSON.stringify(output_players)
  console.log("ouput created")
  console.log(output)
  res.write(output);
  res.end();
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
        req.session.playlist = 0
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

app.post('/selectPlaylist', function(req, res) {
  var postdata = ''
  req.on('data', function(d) {
    postdata += d
    if (postdata.length > 1e6) {
      // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      request.connection.destroy();
    }
  })
  req.on('end', function() {
    if (req.session) {
      req.session.playlist = postdata
    }
    console.log(req.session.name + ' selected ' + postdata)
    res.send()
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
app.get('/getGameData', function (req, res) {
  var game = {name: req.session.name, playlist: req.session.playlist}
  res.send(game)
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
