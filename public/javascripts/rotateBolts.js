var play = document.getElementById("play");

var rules = document.getElementById("rules");

var bolt1 = document.getElementById("boltLeft1");
var bolt2 = document.getElementById("boltRight1");

var bolt3 = document.getElementById("boltLeft2");
var bolt4 = document.getElementById("boltRight2");

play.addEventListener("mouseover", func1, false);
play.addEventListener("mouseout", func2, false);

rules.addEventListener("mouseover", function1, false);
rules.addEventListener("mouseout", function2, false);

function func1()
{  
   bolt1.className += "rotate";
   bolt2.className += "rotate";
}

function func2()
{  
   bolt1.className = "";
   bolt2.className = "";
}

function function1()
{  
   bolt3.className += "rotate";
   bolt4.className += "rotate";
}

function function2()
{  
   bolt3.className = "";
   bolt4.className = "";
}