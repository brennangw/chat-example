
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
    console.log("passed string: " + strInfo);
    console.log("trying to find room: " + info[1]);

      var index;
      for (count = 0; count < rooms.length; ++count){ //entry checks, check the room name, password, unique

        console.log("name: " + rooms[count].name);

          if (String(rooms[count].name) === String(info[1])) { //room name check
            console.log("passed room name check");
            
            console.log("password: " + String(rooms[count].password));
            if (String(rooms[count].password) === String(info[2])){ //password check
              console.log("passed room password check");

              var uniqueName = true;

              for (var j = 0; j < rooms[count].clients.length; j++) { //unique name check
                if (String(rooms[count].clients[j]) === String(info[0])) {
                  uniqueName = false;
                }
              }

              if (uniqueName) { 
                rooms[count].clients.push(socket);
                console.log("found the room and socket added to it");
                index = count;
                socket.emit('requestEntryResponse', index);
              } else { //FAILING UNIQUE NAME TEST
                socket.emit('requestEntryResponse', "non-unique name");
              }

            } else { //FAILNG PASSWORD TEST
              console.log("failed password");
              socket.emit('requestEntryResponse', "failed password");
            }
      }
      console.log("emiting giveRoomIndex next.");
    }
  });
  
  socket.on('startRoom', function(strInfo){
    console.log("passed string: " + strInfo);
    var info = strInfo.split(",");
    var newRoom = new Room(info[1]);
    socket.nickname = String(info[0]);
    console.log("started room: " + newRoom.name)
    newRoom.password = String(info[2]);
    newRoom.clients.push(socket);
    rooms.push(newRoom);
    var index = rooms.indexOf(newRoom);
    socket.emit('requestEntryResponse', index);
  });

  socket.on('chat message', function(msg){
    console.log("messaged recived");
    var info = msg.split(",");
    var message = info[0];
    var roomNum = info[1];
    console.log("messaged recived (before if)"); 
    if (roomNum){
     console.log("message: " + message + ",roomNum: " + roomNum);
      var namedRoomIndex;
      var activeRoom = rooms[roomNum];
      var count;
      for (count = 0; count < activeRoom.clients.length; ++count){
        console.log(activeRoom.clients[count].nickname);
        if (socket != activeRoom.clients[count]){
          activeRoom.clients[count].emit('chat message', message);
        }
      }
    }
  });

  socket.on('disconnect', function () {
    console.log(socket.nickname + " has disconnected");
	});
});

//server info
var port = 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});