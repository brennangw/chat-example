
var app = require('express')(); //getting the express object.
var http = require('http').Server(app);  //getting an https erver onject that with express
var io = require('socket.io')(http); // creating a io object. I asked about the http server part. 

app.get('/', function(req, res){ // get request at the root the call back's
  res.sendfile('index.html');    // response object (res) servers the index.html file
});

sockets = {};

io.on('connection', function(socket){

	socket.on('join', function(name){
		socket.nickname = name;
		io.emit('chat message', 'WELCOME: ' + name);
	});

  	socket.on('chat message', function(msg){

  		socket.broadcast.emit('chat message', socket.nickname + ": " + msg);
  });

  	socket.on('disconnect', function () {
  		socket.broadcast.emit('chat message', socket.nickname + " has disconnected");
  	});


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

