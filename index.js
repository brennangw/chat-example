//getting the express object.
var app = require('express')();
//getting an https erver onject that with express
var http = require('http').Server(app);  
// creating a io object. I asked about the http server part. 
var io = require('socket.io')(http);


var scramble = require('./scramble');

var rooms = [];
function Room(name){
	this.name = name;
 	this.clients = [];
	this.password;
	this.game;
	this.activegame = false;

}


function Game(sockets){
	this.players = [];
	for (i = 0; i < sockets.length; i++){
		this.players[i] = new Player(sockets[i]);	
	}
	this.players = scramble(this.players);
	this.activeplayerindex = 0;

	updateG : function(){


		for (i = 0; i < this.players.length ;++i){
			var p_update_info;
			this.players[i].updateP(p_update_info);
		}

	}
} 

function Player(socket){
	this.socket = socket;
	this.score = 0;
	updateP : function(info){
		this.socket.emit('game_update',update_info);
	}	
}

// get request at the root the call back's
app.get('/', function(req, res){ 
	// response object (res) servers the index.html file
  	res.sendfile('index.html');    
});

// get request at the root the call back's
app.get('/chat', function(req, res){   
 // response object (res) servers the index.html file
	res.sendfile('chat.html');  
});

io.on('connection', function(socket){

  socket.on('requestEntry', function(strInfo){
    
    var info = strInfo.split(",");
    socket.nickname = String(info[0]);
    console.log("passed string: " + strInfo);
    console.log("trying to find room: " + info[1]);

      var index;
	//entry checks, check the room name, password, unique
      for (count = 0; count < rooms.length; ++count){ 
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
		socket.roomNum = index;
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
	socket.roomNum = index
  });

  socket.on('chat message', function(msg){
    console.log("messaged recived");
    var info = msg.split(",");
    var message = info[0];
    var roomNum = socket.roomNum;
    console.log("messaged recived (before if)"); 
    if (roomNum != null){ // why is this not enough
     console.log("message: " + message + ",roomNum: " + roomNum);
      var namedRoomIndex;
      var activeRoom = rooms[roomNum];
      var count;
      if (activeRoom != null){
      for (count = 0; count < activeRoom.clients.length; ++count){
        console.log(activeRoom.clients[count].nickname);
        if (socket != activeRoom.clients[count]){
          activeRoom.clients[count].emit('chat message', message);
        }
      }}
    }
  });

	  socket.on('disconnect', function () { //this seems slow.
		var k;
	    	for(k = 0; k < rooms.length; ++k){
			var l;
			for (l = 0; l < rooms[k].clients.length; ++l){
				if(rooms[k].clients[l] === socket){
					if(rooms[k].length === 1){
						console.log(Room.name + "has been removed, a room");
						rooms.splice(k);
					} else {
						console.log(socket.nickname + "has been removed, a client");
						rooms[k].clients.splice(l);
					}
				}				
			}
		}
		console.log(socket.nickname + " has disconnected");
	});

	socket.on('gameinfo', function(ginfo){
		//create a new game

		if(socket.roomNum != null){

		var currentRoom = rooms[socket.roomNum];
		if (!rooms[socket.roomNum].activegame){
			console.log("socket.roomNum: " + socket.roomNum);
			rooms[socket.roomNum].game = new Game(rooms[socket.roomNum].clients);
			rooms[socket.roomNum].activegame = true;

		}
		}
	});


});

//server info
var port = 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

/*
*  
*
*
*
*/

