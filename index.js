
var app = require('express')(); //getting the express object.
var http = require('http').Server(app);  //getting an https erver onject that with express
var io = require('socket.io')(http); // creating a io object. I asked about the http server part. 

var rooms = [];
function Room(){
  this.clients = [];
  this.password;
}
//seeing if this works
rooms[0] = new Room();

app.get('/', function(req, res){ // get request at the root the call back's
  res.sendfile('index.html');    // response object (res) servers the index.html file
});

app.get('/chat', function(req, res){ // get request at the root the call back's
  res.sendfile('chat.html');    // response object (res) servers the index.html file
});


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
var port = 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

