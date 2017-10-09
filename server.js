var http = require('http')
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
