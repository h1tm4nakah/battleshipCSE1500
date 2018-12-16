var Player = require('./player.js');

function Game(id, p1, p2) {
  this.id = id;
  this.player1 = p1;
  this.player2 = p2;
  this.currentPlayer = Math.floor(Math.random() * 2);
  this.gameStatus = 0;// 0 in progress, 1 finished;
  this.elapsedTime = new Date();
}

module.exports = Game;