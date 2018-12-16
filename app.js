var express = require("express");
var http = require("http");
var websocket = require("ws");
var routes = require('./routes/index');
var Player = require("./player");
var Game = require("./game");
const util = require('util')


//------------------VARS-------------------
var playersQueue = [];
var playersIndex = 0;
var games = [];
var gamesIndex = 0;
//-----------------/VARS-------------------


var port = process.argv[2];
var app = express();
app.use(express.static(__dirname + '/public'));
app.use('/', routes);

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
	var average_time = 0;
	var games_completed = 0;
	var ongoing_games = 0;
	for(var i=0;i<games.length;i++){
		if(games[i].gameStatus === 1){
			average_time += games[i].elapsedTime;
			games_completed++;
		} else {
			ongoing_games++;
		}
	}
	average_time = Math.round(average_time/games_completed);
	if(isNaN(average_time)) average_time = 0;
    res.render('splash.ejs', { averageTime: average_time, gamesCompleted: games_completed, gamesActive: ongoing_games});
});

var server = http.createServer(app);
const wss = new websocket.Server({ server });


wss.on("connection", function(ws) {
	console.log("New Player joined the queue, index: " + playersIndex);
	var player = new Player(playersIndex)										// instantiate a new Player with his ID
	playersQueue.push(player);													// push the player into the players queue
	ws.player = player;															// save the player reference inside the WebSocket object
	playersIndex++;																// increment the playerIndex counter
	if(playersQueue.length == 2){												// if the queue has 2 players, start a new game
		startNewGame(playersQueue[0],playersQueue[1]);
	}

    ws.on("message", function incoming(message) {
        message = JSON.parse(message);
        console.log("Player id: " + ws.player.id + " shooting on cell: " + message.value);
        wss.clients.forEach(function each(client) {
        	if((client.player.gameid == ws.player.gameid)&&(client.player.id != ws.player.id)){ 		// check if exists the opponent
        		var opponent = client.player;															// retreive it
        		tryToHit(message.value,ws.player,opponent);												// call thetryToHit function	
        		opponent.enemyShips = ws.player.returnShipsFiltered();
        		ws.player.enemyShips = 	opponent.returnShipsFiltered();													
        		client.send(JSON.stringify(opponent));													// Update UI
        		ws.send(JSON.stringify(ws.player));														// Update UI
        	}
	    });
	    
    });

    ws.on('close', function close() {
	  // if the player drop the game, the opponent automatically win
	  console.log("Player " + ws.player.id + " DISCONNECTED");
	  if(ws.player.gameid === null){
	  	playersQueue.pop();	// i can do this because there can be only 1 player in the queue!!
	  	console.log("Player " + ws.player.id + " REMOVED FROM THE QUEUE");
	  } else {
		  wss.clients.forEach(function each(client) {
	        	if((client.player.gameid == ws.player.gameid)&&(client.player.id != ws.player.id)){
	        		var opponent = client.player;															
	        		opponent.myStatus = 1; 																	// opponent won
	        		ws.player.myStatus = 2;
	        		for(var i=0;i<games.length;i++){
						if(games[i].id == ws.player.gameid){
							games[i].gameStatus = 1;													// update game status
							games[i].elapsedTime = Date.now() - games[i].elapsedTime;
							games[i].elapsedTime /= 1000;
							games[i].elapsedTime = Math.round(games[i].elapsedTime);
							console.log("Game finished after " + games[i].elapsedTime + " seconds");
						}
					}																					// disconnected player lost																								// Switch Turn		
	        		client.send(JSON.stringify(opponent));												// Update UI
	        	}
		    });
		}
	});

});
// functions 
function startNewGame(p1,p2){
	console.log("Started a new game with player1 id: "+ p1.id + " and player2 id: " + p2.id);
	var temp = new Game(gamesIndex,p1,p2);			// create a new Game
	p1.setGameID(temp.id);							// Assign to each players the game ID
	p2.setGameID(temp.id);							//
	p1.setIsPlaying(true);							// the first one who joined play first
	p2.setIsPlaying(false); 						//
	games.push(temp);								// push the game into the games array
	playersQueue.pop();								// remove the 2 players from the Queue
	playersQueue.pop();								//
	gamesIndex++;									// increase game index
	wss.clients.forEach(function each(client) {
        	if(client.player.id == p1.id){	
        		client.send(JSON.stringify(p1));
        	}
        	if(client.player.id == p2.id){
        		client.send(JSON.stringify(p2));
        	}
	    });
}
function tryToHit(coordinate,player,opponent){
	if(opponent.getShot(coordinate)){ 			// check if its an hit or a miss, if its an hit dont switch turn
		console.log("Player " + player.id + " HITTED enemy " + opponent.id + " on cell " + coordinate);
		player.shot(coordinate,1);
		if(opponent.checkLose()){
			player.myStatus = 1;
			for(var i=0;i<games.length;i++){
				if(games[i].id == player.gameid){
					games[i].gameStatus = 1;
					games[i].elapsedTime = Date.now() - games[i].elapsedTime;
					games[i].elapsedTime /= 1000;
					games[i].elapsedTime = Math.round(games[i].elapsedTime);
					console.log("Game finished after " + games[i].elapsedTime + " seconds");
				}
			}
		}
	} else {									// else if its a miss,  Switch Turn
		console.log("Player " + player.id + " MISSED enemy " + opponent.id + " on cell " + coordinate);
		player.shot(coordinate,2);
        opponent.switchTurn();			
		player.switchTurn();	
	}
}
server.listen(port);
