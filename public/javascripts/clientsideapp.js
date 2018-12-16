$(document).ready( function () {
    var containerDiv = document.getElementById("shootsC");
    containerDiv.addEventListener("click", shootHere, false);
});
function shootHere(event) {
    var str = event.target.id;
    str = str.slice(3, 5);
    console.log("shooting on cell: "+str);
    var msg = {
        type: "shot",
        value: str
      };
    console.log("cannot shot on already shoot cell");
    if((event.target.className != "isHit")&&(event.target.className != "isMiss")){
        socket.send(JSON.stringify(msg));
    }
    
}

var socket = new WebSocket("ws://0.0.0.0:3000");

socket.onmessage = function(event){
    console.log(event.data);
    var data = JSON.parse(event.data);
    console.log(data);
    // CHECK WIN
    if(data.myStatus == 1) alert("You WON the game, reload the page to start a new one");
    if(data.myStatus == 2) alert("You LOST the game, reload the page to start a new one");
    // UPDATE UI
    var userText = document.getElementById("userText");
    if(data['isPlaying']){
        userText.innerHTML = "It's Your Turn";
        document.getElementById("shootsC").style.pointerEvents = "auto";
        document.getElementById("shootsC").style.cursor = "crosshair";
    } else {
        userText.innerHTML = "It's The Opponent Turn";
        document.getElementById("shootsC").style.pointerEvents = "none";
        document.getElementById("shootsC").style.cursor = "not-allowed";
    }
    // UPDATE SHPS NUMBER
    if(data.enemyShips){
        var enemyDestroyer = 0;
        var enemySubmarine = 0;
        var enemyCarrier = 0;
        for(var i=0;i<data.enemyShips.length;i++){
            if((data.enemyShips[i].size == 2) && (data.enemyShips[i].sunk == false)){
                enemyDestroyer++;
            }
            else if((data.enemyShips[i].size == 3) && (data.enemyShips[i].sunk == false)){
                enemySubmarine++;
            } else if((data.enemyShips[i].size == 4) && (data.enemyShips[i].sunk == false)){
                enemyCarrier++;
            }
        }
        document.getElementById("enemyDestroyer").innerHTML = enemyDestroyer;
        document.getElementById("enemySubmarine").innerHTML = enemySubmarine;
        document.getElementById("enemyCarrier").innerHTML = enemyCarrier;
        var playerDestroyer = 0;
        var playerSubmarine = 0;
        var playerCarrier = 0;
        for(var i=0;i<data.ships.length;i++){
            if((data.ships[i].size == 2) && (data.ships[i].sunk == false)){
                playerDestroyer++;
            }
            else if((data.ships[i].size == 3) && (data.ships[i].sunk == false)){
                playerSubmarine++;
            } else if((data.ships[i].size == 4) && (data.ships[i].sunk == false)){
                playerCarrier++;
            }
        }
        document.getElementById("playerDestroyer").innerHTML = playerDestroyer;
        document.getElementById("playerSubmarine").innerHTML = playerSubmarine;
        document.getElementById("playerCarrier").innerHTML = playerCarrier;

    }
    //UPDATE SHIPS GRID
    var containerDiv = document.getElementById("shipsC");
    var innerDivs = containerDiv.getElementsByTagName("DIV");
    for(var i=0; i<innerDivs.length; i++)
    {   
        if(data['shipsGrid'][i] == 3) innerDivs[i].className = "isBoatMiss ";
    }
    data.ships.forEach(function each(ship) {
        if(ship.orientation){
            for(var i=0;i<ship.size;i++){
                switch(ship.size){
                    case 2 :
                        if(data['shipsGrid'][ship.x+i] == 2) {
                            innerDivs[ship.x+i].className = "isBoatHit isBoatSmall"+i;
                        } else {
                            innerDivs[ship.x+i].className = "isBoatSmall"+i;
                        }
                        break;
                    case 3 :
                        if(data['shipsGrid'][ship.x+i] == 2){
                            innerDivs[ship.x+i].className = "isBoatHit isBoatMid"+i;
                        } else {
                            innerDivs[ship.x+i].className = "isBoatMid"+i;
                        }
                        break;
                    case 4 :
                        if(data['shipsGrid'][ship.x+i] == 2){
                            innerDivs[ship.x+i].className = "isBoatHit isBoatBig"+i;
                        } else {
                            innerDivs[ship.x+i].className = "isBoatBig"+i;
                        }
                        break;
                }
            }
        } else {
            for(var i=0;i<ship.size;i++){
                switch(ship.size){
                    case 2 :
                        if(data['shipsGrid'][ship.x+(i*10)] == 2) innerDivs[ship.x+(i*10)].className = "isBoatHit isBoatSmall"+i+" isBoatVertical";
                        else innerDivs[ship.x+(i*10)].className = "isBoatSmall"+i+" isBoatVertical";
                        break;
                    case 3 :
                        if(data['shipsGrid'][ship.x+(i*10)] == 2) innerDivs[ship.x+(i*10)].className = "isBoatHit isBoatMid"+i+" isBoatVertical";
                        else innerDivs[ship.x+(i*10)].className = "isBoatMid"+i+" isBoatVertical";
                        break;
                    case 4 :
                        if(data['shipsGrid'][ship.x+(i*10)] == 2) innerDivs[ship.x+(i*10)].className = "isBoatHit isBoatBig"+i+" isBoatVertical";
                        else innerDivs[ship.x+(i*10)].className = "isBoatBig"+i+" isBoatVertical";
                        break;
                }
            }
        }
    });
    //UPDATE SHOTS GRID
    var containerDiv = document.getElementById("shootsC");
    var innerDivs = containerDiv.getElementsByTagName("DIV");
    for(var i=0; i<innerDivs.length; i++)
    {   
        if(data['shots'][i] == 1){
            innerDivs[i].className = "isHit";
            innerDivs[i].removeEventListener("click", shootHere);
        }
        if(data['shots'][i] == 2){
            innerDivs[i].className = "isMiss";
            innerDivs[i].removeEventListener("click", shootHere);
        }

    }
}