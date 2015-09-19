
Game = {};

Game.intilize = function() {
	Game.version = 0.01;
	Game.state = "Alpha";

	Game.fps = 30;
	Game.money = 0.00;
	Game.perSec = 0.01;
	Game.perTap = 0;
	Game.TotalClick = 0;

	Game.perLoop = perSec/fps;

	$('#perTap').text("$ " + parseFloat(calcPrefix(perTap, 2)).toFixed(3) + " " + prefix[currentPrefix[2]] + " per tap");
	$('#perSec').text("$ " + parseFloat(calcPrefix(perSec, 1)).toFixed(3) + " " + prefix[currentPrefix[1]] + " per second");
	AddEvent();
	Game.Loop();
};

function AddEventClick() {
	$('#Clicker').click(function(event) {
		Game.money += Game.perTap;
	});
}

//Drawing

var fps = 30;

//Stats

var money = 0.00;
var perSec = 100000000000000000000000000000000000000000;
var perTap = 148635489463541321368849839848963510987984089709;
var perLoop = 0;

//Prefix

var numPrefix = 0;
var currentPrefix = [0,0,0];
var prefix = ["", "K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "d", "U", "D", "!", "@", "#", "$", "%", "^", "&", "*", "*1", "*2", "*3", "*4", "*5", "*6", "*7", "*8", "*9", "*10"];

//Images handler



//Upgrades handler
var upgrades = [];



function calcPerLoop(number) {
	return number/fps;
}

function getInfoString(number, x) {
	var returnnum = number;
	while (x > 0) {
		returnnum /= 1000;
		x--;
	}
	return returnnum;
}

function calcPrefix(number, n) {
	
	var l = parseFloat(getInfoString(number, x)).toFixed(0).toString().length;
	var x = 0;

	while (l >= 4) {
		x++;
		l = parseFloat(getInfoString(number, x)).toFixed(0).toString().length;
	}
	currentPrefix[n] = x;
	return getInfoString(number, x);
}



/* ---------------- Main logic ---------------- */

Game.Logic = function() {

};


/* ---------------- Main game loop ---------------- */

Game.Loop = function() {
	Game.Logic();
	Game.money += Game.perLoop;
	$('#money').text("$ " + parseFloat(calcPrefix(Game.money, 0)).toFixed(3) + " " + prefix[currentPrefix[0]]);
	setTimeout(Game.Loop, 1000/fps);
};




$(document).ready(function() {
	Game.intilize();
});