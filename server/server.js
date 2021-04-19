var app = require('http').createServer(handler)
  , io = require('socket.io')(app)
  , fs = require('fs')

//const express = require('express');
//const app = express();
//const http = require('http');
//const server = http.createServer(app);
//const io = require('socket.io')(server);

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var lastPosition = { x: 0, y: 0 }; // whatever default data

io.sockets.on('connection', function (socket) {
  socket.emit('update_position', lastPosition);
  socket.on('receive_position', function (data) {
     lastPosition = data;
     socket.broadcast.emit('update_position', data); // send `data` to all other clients
  });
});