
var app = require('express')(); //getting the express object.
var http = require('http').Server(app);  //getting an https erver onject that with express
var io = require('socket.io')(http); // creating a io object. I asked about the http server part. 

var rooms = [];
function Room(name){
  this.name = name;
  this.clients = [];
  this.password;
}

app.get('/', function(req, res){ // get request at the root the call back's
  res.sendfile('index.html');    // response object (res) servers the index.html file
});

app.get('/chat', function(req, res){ // get request at the root the call back's
  res.sendfile('chat.html');    // response object (res) servers the index.html file
});


io.on('connection', function(socket){

  socket.on('requestEntry', function(strInfo){
    var info = strInfo.split(",");
    socket.nickname = String(info[0]);
    for (count = 0; count < rooms.length; ++count){
        if (rooms[count].name === info[1]){
          rooms[count].clients.push(socket);
        }
    }
    var roomNum = rooms.indexOf();
  });

  socket.on('startRoom', function(strInfo){
    var info = strInfo.split(",");
    var newRoom = new Room(info[1]);
    socket.nickname = String(info[0]);
    newRoom.clients.push(socket);
    rooms.push(newRoom);
    var index = rooms.indexOf(newRoom);
    io.emit('giveRoomIndex', index);
  });

	//socket.on('join', function(name){
	//	socket.nickname = name;
	//	io.emit('chat message', 'WELCOME: ' + name);
	//});

  	socket.on('chat message', function(msg){
      var info = msg.split(",");
      var message = info[0];

      //issue need to use the name to find the roomNum
      var roomNum = info[1];
      console.log("RN: " + roomNum);
      var activeRoom = rooms[roomNum];
      var count;
      for (count = 0; count < activeRoom.clients.length; ++count){
        console.log(message);
      }
      


  		//socket.broadcast.emit('chat message', socket.nickname + ": " + msg);
  });

  	socket.on('disconnect', function () {
  		socket.broadcast.emit('chat message', socket.nickname + " has disconnected");
  	});


});
var port = 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

