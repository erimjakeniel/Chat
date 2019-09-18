var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var clients =[];


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', function (socket) {
  socket.on('username', function (username) {
    socket.username = username;
    io.emit('is_online', '🔵 <i>' + socket.username + ' join the group. ..</i>');
    clients.push(socket);
		users = getUserList();
		io.emit("userList", users);


  });
  socket.on('disconnect', function (username) {
      clients = clients.filter(function(e){  
        return e!==socket;
      });
      updateUsernames();
      io.emit('is_online', '🔴 <i>' + socket.username + ' left the group...</i>');

  })


  socket.on('chat message', function (msg) {
    io.emit('chat message', '<strong>' + socket.username + '<strong>: ' + msg);
  });

  function updateUsernames(){
		users = getUserList();
		io.emit("userList", users);
	}

  function getUserList(){
		var ret = [];
		for(var i=0;i<clients.length;i++){
			ret.push(clients[i].username);
		}
		return ret;
	}
});


var sever = http.listen(port, function () {
  console.log('listening on *:' + port);
});
