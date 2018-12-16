var express = require("express");		// our framework
var router = express.Router(); 			// The router allow us to call routes inside the routes/index.js file


router.get('/game',function(req,res){
  res.sendFile("game.html", {root: "./public"});
});

module.exports = router;
