/* GAME */

version = 0.01;
state = "Alpha";

//Stats

fps = 30;
money = 0.00;
perSec = 0.01;
perTap = 1;
TotalClick = 0;

perLoop = perSec/fps;

//Prefix

prefix = ["", "K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "d", "U", "D", "!", "@", "#", "$", "%", "^", "&", "*", "*1", "*2", "*3", "*4", "*5", "*6", "*7", "*8", "*9", "*10"];
currentPrefix = [0,0,0];

//Upgrades/PC handler
var upgradesPerPc = 5;
var upgrades = [];
var items = [];
var upgradIndex = 0;

var pcs = [];
var pcIndex = 0;

//updaters

var updateSec = 0;
var updateTap = 0;


object = function(name, folder, numimg, cost, base, percent, bought) {
	this.name = name;
	this.folder = folder;
	this.numimg = numimg;
	this.cost = cost;
	this.base = base;
	this.percent = percent;
	this.bought = bought;
};



function intilize() {
	$('#perTap').text("$ " + parseFloat(calcPrefix(perTap, 2)).toFixed(3) + " " + prefix[currentPrefix[2]] + " per tap");
	$('#perSec').text("$ " + parseFloat(calcPrefix(perSec, 1)).toFixed(3) + " " + prefix[currentPrefix[1]] + " per second");

	//Click events

	$('#Clicker').unbind().click(function(event) {
		money += perTap;
		TotalClick++;
	});

	$('.item').unbind().click(function(event) {
		HandleUpgrade(this.id);
	});

	//Load upgrades
	//This is the load order.
	//Dont add in between or the save file will not work anymore
	upgrades[upgradIndex] = new object("Disk", "images/DiskPc1/", 2, 10, 0.2, 10, 0); upgradIndex++;


	initUpgrades();

	GameLoop();
}

function initUpgrades() {
	items[0] = upgrades[0];

	DrawItem(0);
}


function HandleUpgrade(id) {
	var num = parseInt(id.substr(id.length - 1))-1;
	if (money >= items[num].cost) {
		money -= items[num].cost;
		perSec += items[num].base * Math.pow(1 + items[num].percent/100, items[num].bought);
		items[num].bought++;
		items[num].cost += items[num].cost *  items[num].percent/100;
		updateSec = 1;
		DrawItem(num);
	}
}

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
	var x = 0;
	var l = parseFloat(getInfoString(number, x)).toFixed(0).toString().length;

	while (l >= 4) {
		x++;
		l = parseFloat(getInfoString(number, x)).toFixed(0).toString().length;
	}
	currentPrefix[n] = x;
	return getInfoString(number, x);
}

/* =========================================
Draw
========================================= */

Draw = function() {
	$('#money').text("$ " + parseFloat(calcPrefix(money, 0)).toFixed(3) + " " + prefix[currentPrefix[0]]);

	if (updateSec == 1) {
		$('#perSec').text("$ " + parseFloat(calcPrefix(perSec, 1)).toFixed(3) + " " + prefix[currentPrefix[1]] + " per second");
	}
	if (updateTap == 1) {
		$('#perTap').text("$ " + parseFloat(calcPrefix(perTap, 2)).toFixed(3) + " " + prefix[currentPrefix[2]] + " per tap");
	}

};

function DrawItem(index) {
	var strid = "item" + (index+1) + "-img";
	if (items[index].numimg >= items[index].bought+1) 
		$('#' + strid).attr("src", items[index].folder + (items[index].bought+1) + ".png");
	else
		$('#' + strid).attr("src", '');

	strid = "item" + (index+1) + "-cost";
	$('#' + strid).text('Cost $ ' + parseFloat(items[index].cost).toFixed(3));
	strid = "item" + (index+1) + "-upgrade";
	$('#' + strid).text('$ ' + parseFloat(items[index].base * Math.pow(1 + items[index].percent/100, items[index].bought)).toFixed(3) + " per second");
}


/* =========================================
Main logic 
========================================= */

GameLogic = function() {
	money += perLoop;
};

/* =========================================
Main game loop 
========================================= */

GameLoop = function() {
	if (updateSec == 1) {
		perLoop = perSec/fps;
	}

	GameLogic();
	Draw();
	updateSec = 0;
	updateTap = 0;
	setTimeout(GameLoop, 1000/fps);
};
	

$(document).ready(function() {
	intilize();
});