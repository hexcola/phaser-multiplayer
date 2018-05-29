const io = require('socket.io')();
const player = require('./player');
let player_lst = [];

io.sockets.on('connection', function(socket){
	console.log("socket connected"); 
	
	// listen for disconnection; 
	socket.on('disconnect', onClientdisconnect); 
	
	// listen for new player
    socket.on("new_player", onNewplayer);
    
	// listen for player position update
	socket.on("move_player", onMovePlayer);
});

/**
 * call when a client disconnects and tell the clients except sender to remove the disconnected player
 */
const onClientdisconnect = () => {
	console.log('disconnect'); 

	var removePlayer = find_playerid(this.id); 
		
	if (removePlayer) {
		player_lst.splice(player_lst.indexOf(removePlayer), 1);
	}
	
	console.log("removing player " + this.id);
	
	//send message to every connected client except the sender
	this.broadcast.emit('remove_player', {id: this.id});
}


/**
 * find player by the the unique socket id 
 * @param {*} id 
 */
const find_playerid = (id) => {
	for (var i = 0; i < player_lst.length; i++) {
		if (player_lst[i].id == id) {
			return player_lst[i]; 
		}
	}	
	return false; 
}

/**
 * when a new player connects, we make a new instance of the player object,
 * and send a new player message to the client. 
 * @param {*} data 
 */
const onNewplayer = (data)=>{
	console.log(data);
	//new player instance
	var newPlayer = player(data.x, data.y, data.angle);
	console.log(newPlayer);
	console.log("created new player with id " + this.id);
	newPlayer.id = this.id; 	
	//information to be sent to all clients except sender
	var current_info = {
		id: newPlayer.id, 
		x: newPlayer.x,
		y: newPlayer.y,
		angle: newPlayer.angle,
	}; 
	
	//send to the new player about everyone who is already connected. 	
	for (i = 0; i < player_lst.length; i++) {
		existingPlayer = player_lst[i];
		var player_info = {
			id: existingPlayer.id,
			x: existingPlayer.x,
			y: existingPlayer.y, 
			angle: existingPlayer.angle,			
		};
		console.log("pushing player");
		//send message to the sender-client only
		this.emit("new_enemyPlayer", player_info);
	}
	
	//send message to every connected client except the sender
	this.broadcast.emit('new_enemyPlayer', current_info);
	
	player_lst.push(newPlayer); 
}

/**
 * update the player position and send the information back to every client except sender
 * 
 * @param {*} data 
 */
const onMovePlayer = (data) => {
	var movePlayer = find_playerid(this.id); 
	movePlayer.x = data.x;
	movePlayer.y = data.y;
	movePlayer.angle = data.angle; 
	
	var moveplayerData = {
		id: movePlayer.id,
		x: movePlayer.x,
		y: movePlayer.y, 
		angle: movePlayer.angle
	}
	
	//send message to every connected client except the sender
	this.broadcast.emit('enemy_move', moveplayerData);
}

module.exports = io