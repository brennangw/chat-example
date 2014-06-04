
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
    console.log("passed string: " + strInfo);
    var info = strInfo.split(",");
    socket.nickname = String(info[0]);
    console.log("trying to find room: " + info[1]);

    var index;
    for (count = 0; count < rooms.length; ++count){

      console.log("name: " + rooms[count].name);

        if (String(rooms[count].name) === String(info[1])) {
          rooms[count].clients.push(socket);
          console.log("found the room");
          index = count;
        }
    }
    //var roomNum = rooms.indexOf(room.name);
    console.log("emiting giveRoomIndex next.");
    socket.emit('giveRoomIndex', index);
    //need to pass this back.
  });

  socket.on('startRoom', function(strInfo){
    console.log("passed string: " + strInfo);
    var info = strInfo.split(",");
    var newRoom = new Room(info[1]);
    socket.nickname = String(info[0]);
    console.log("started room: " + newRoom.name)
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
      var roomNum = info[1];
      if (roomNum > -1){

        console.log("message: " + message + ",roomNum: " + roomNum);

        var namedRoomIndex;

        // for (var i = 0; i < rooms.length; i++) {
        //   if (rooms[i].name ===  
        // };

        //issue need to use the name to find the roomNum
        var activeRoom = rooms[roomNum];
        var count;
        for (count = 0; count < activeRoom.clients.length; ++count){
          console.log(activeRoom.clients[count].nickname);
          if (socket != activeRoom.clients[count]){
            activeRoom.clients[count].emit('chat message', message);
          }

        }
      }
      
  		//socket.broadcast.emit('chat message', socket.nickname + ": " + msg);
  });

  	socket.on('disconnect', function () {
  		//socket.broadcast.emit('chat message', socket.nickname + " has disconnected");
  	});


});
var port = 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

