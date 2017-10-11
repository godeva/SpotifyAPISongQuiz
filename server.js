// my server
var express = require('express')
, path = require('path')
, session = require('express-session')
, fs = require('fs')
, qs = require('querystring')
, db = require('sqlite3')
, port = 8080

// active players
// player definition: {name: string, currentScore: int, bestScore: int}
var playerList = []
var activeList = []
const app = express()


app.use(session({
  secret: 'keyboard meow',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 * 60 * 24 },
  rolling: true
}))

app.use(express.static(path.join(__dirname, 'public/static')))

app.get('/index.html', indexHandler)

app.get('/', indexHandler)

app.get('/lobby.html', lobbyHandler)

app.get('/lobby', lobbyHandler)

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
// POST: player logs in
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


app.listen(process.env.PORT || port)
console.log('listening on ' + port)

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