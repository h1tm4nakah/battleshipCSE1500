var Settings = require('./settings.js');

function Ship(size) {
	this.size = size;
	this.orientation = Math.random() < 0.5; 					// 0 orizzontal, 1 vertical
	if(this.orientation){
		var y = (Math.floor(Math.random() * (Settings.gridCols-1))); 				// generate y
		var x = (Math.floor(Math.random() * (Settings.gridRows-this.size)));	// generate x
		this.x = 1 + x + ((Settings.gridCols*y)-1);
		console.log("ori: " + this.orientation + " x: " + x + " y: " + y + " xy: " + this.x);
	} else {
		var x = (Math.floor(Math.random() * (Settings.gridRows-1))); 				// generate y
		var y = (Math.floor(Math.random() * (Settings.gridCols-this.size)));	// generate x
		this.x = 1 + x + ((Settings.gridRows*y)-1);
		console.log("ori: " + this.orientation + " x: " + x + " y: " + y + " xy: " + this.x);
	}
	this.hits = 0;
	this.sunk = false;
}

Ship.prototype.isHit = function(coordinate) {
	console.log("CHECK HIT ON COORD:" + coordinate);
    for(var i=0;i<this.size;i++){
    	if(this.orientation){
    		console.log("boat at " + (this.x+i));
    		if(coordinate == (this.x+i)) {
    			this.hits++;
    			if(this.isSunk()) this.sunk = true;
    			return true;
    		}
    	} else {
    		console.log("boat at " + (this.x+(10*i)));
    		if(coordinate == this.x+(10*i)) {
    			this.hits++;
    			if(this.isSunk()) this.sunk = true;
    			return true;
    		}
    	}
    }
    return false;
}

Ship.prototype.isSunk = function() {
	if(this.hits == this.size) return true;
	else return false;
}

module.exports = Ship;