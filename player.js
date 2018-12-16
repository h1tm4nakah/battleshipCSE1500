var Ship = require('./ship.js');
var Settings = require('./settings.js');

function Player(id) {
  var i;

  this.id = id;
  this.myStatus = 0;                                    // 0 still playin, 1 won, 2 lost
  this.gameid = null;
  this.isPlaying = false;
  this.shots = Array(Settings.gridSize);                // 10 rows * 10 cols contains the shoots
  // 0 not yet hitted
  // 1 hitted 
  // 2 missed
  this.shipsGrid = Array(Settings.gridSize);             // 10 rows * 10 cols contains the ship grid
  // 0 water
  // 2 hit
  // 3 miss
  this.ships = [];
  this.ships.push(new Ship(4));
  while(this.tryShip(4)){
    
  }
  while(this.tryShip(3)){
    
  }
  while(this.tryShip(3)){
    
  }
  while(this.tryShip(2)){
    
  }
  while(this.tryShip(2)){
    
  }
  for(i = 0; i < Settings.gridSize; i++) {              // init grids
    this.shots[i] = 0;
    this.shipsGrid[i] = 0;
  }
  
};
Player.prototype.tryShip = function(size) {
    console.log("Trying to randomize ship for player #: "+this.id);
    var s = new Ship(size);
    var tempGrid = Array(Settings.gridSize);
    var flag = false;
    for(i = 0; i < Settings.gridSize; i++) {              // init grids
      tempGrid[i] = 0;
    }
    this.ships.forEach(function each(ship) {
        if(ship.orientation){
            for(var i=0;i<ship.size;i++){
                tempGrid[ship.x+i] = 1;
            }
        } else {
            for(var i=0;i<ship.size;i++){
                tempGrid[ship.x+(i*Settings.gridCols)] = 1;
            }
        }
    });
    if(s.orientation){
        for(var i=0;i<s.size;i++){
            if(tempGrid[s.x+i] == 1) flag = true;
        }
    } else {
        for(var i=0;i<s.size;i++){
            if(tempGrid[s.x+(i*Settings.gridRows)] == 1) flag = true;
        }
    }
    if(!flag){
      this.ships.push(s);
    }
    return flag;
}
Player.prototype.setGameID = function(id) {
    this.gameid = id;
}
Player.prototype.setIsPlaying = function(flag) {
    this.isPlaying = flag;
}
Player.prototype.switchTurn = function() {
    if(this.isPlaying) this.isPlaying = false;
    else this.isPlaying = true;
}
Player.prototype.shot = function(coordinate,type) {
    this.shots[coordinate] = type;
}
Player.prototype.getShot = function(coordinate) {
    var flag = false;
    for(var i=0;i<this.ships.length;i++){       // check for each boat
      if(this.ships[i].isHit(coordinate)){
        flag = true;
        break;
      }
    }
    if(flag){                                   // if a boat was there
      this.shipsGrid[coordinate] = 2;           // mark as hitted 
      return 1;                                 // and return true
    } else {                                    // else 
      this.shipsGrid[coordinate] = 3;           // mark as miss
      return 0;                                 // return 0
    }
}
Player.prototype.checkLose = function() {
    var flag = true;
    for(var i=0;i<this.ships.length;i++){
      if(!this.ships[i].isSunk()){
        flag = false;                           // if there's at least one non sunk boat
      }
    }
    if(flag){
      this.myStatus = 2;
      return true;
    } else {
      return false;
    }
}
Player.prototype.returnShipsFiltered = function() {
    var filteredShips = [];
    for(var i=0;i<this.ships.length;i++){
      var s = {
        size: this.ships[i].size,
        sunk: this.ships[i].sunk
      };
      filteredShips.push(s);
    }
    return filteredShips;
}
module.exports = Player;