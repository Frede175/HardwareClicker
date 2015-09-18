$(document).ready(function() {
	startGame();
	gameLoop();

});

var money = 0.00;
var fps = 30;
var perSec = 1000;
var perTap = 0.02;
var perLoop = 0;
var numPrefix = -1;
var divideby = 1;
var i = 1;

var prefix = ["K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "d", "U", "D", "!", "@", "#", "$", "%", "^", "&", "*", "*1", "*2", "*3", "*4", "*5", "*6"];



function startGame() {
	perLoop = calcPerLoop(perSec);
}

function calcPerLoop(number) {
	return number/fps;
}

/*while (true) {
		if (number < 1000) {
			return -1;
		}
		

		i++;
		x+=3;
	}*/

function getInfoString(number) {
	var x = numPrefix+1;
	var returnnum = number;
	while (x > 0) {
		returnnum /= 1000;
		x--;
	}
	return returnnum;
}

function calcPrefix() {
	
	var l = parseFloat(getInfoString(money)).toFixed(0).toString().length;
	
	while (l >= 4) {
		numPrefix++;
		var l = parseFloat(getInfoString(money)).toFixed(0).toString().length;
	}
}


gameLoop=function() {
	money += perLoop;
	calcPrefix();
	if (numPrefix == -1 ) {
		$('#money').text("$ " + (parseFloat(money).toFixed(3)));
	}
	else
	{
		$('#money').text("$ " + parseFloat(getInfoString(money)).toFixed(3) + " " + prefix[numPrefix]);
	}

	setTimeout(gameLoop, 1000/fps);
}