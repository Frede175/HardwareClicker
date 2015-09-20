/* GAME */

var version = 0.02;
var state = "Alpha";

//Stats

var targetFps = 30;
var fps = targetFps;
var money = 0.00;
var perSec = 0.01;
var perTap = 1;
var TotalClick = 0;

var perLoop = perSec/fps;

//Prefix

var prefix = ["", "K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "d", "U", "D", "!", "@", "#", "$", "%", "^", "&", "*", "*1", "*2", "*3", "*4", "*5", "*6", "*7", "*8", "*9", "*10"];
var currentPrefix = [0,0,0];

//Upgrades/PC handler
var upgradesPerPc = 5;
var upgrades = [];
var items = [];
var upgradIndex = 0;

var pcs = [];
var pcIndex = 0;
var pcLevel = 0;
var pcLevelUnlocked = 1;
var pcLevelDrawed = 0;

//updaters

var updateSec = 0;
var updateTap = 0;

//Click handler (autoclicker limit)
var lastClick = 0;
var click = 0;


//Updater

var lastUpdate = new Date().getTime();



upgrade = function(name, folder, numimg, cost, base, percent, bought) {
	this.name = name;
	this.folder = folder;
	this.numimg = numimg;
	this.cost = cost;
	this.base = base;
	this.percent = percent;
	this.bought = bought;
};

pc = function(name, img, cost, owned) {
	this.name = name;
	this.img = img;
	this.cost = cost;
	this.owned = owned;
};



function intilize() {
	//Set version

	$('#version').text('Version: ' + version + " " + state);


	$('#perTap').text("$ " + parseFloat(calcPrefix(perTap, 2)).toFixed(3) + " " + prefix[currentPrefix[2]] + " per tap");
	$('#perSec').text("$ " + parseFloat(calcPrefix(perSec, 1)).toFixed(3) + " " + prefix[currentPrefix[1]] + " per second");


	//Load upgrades
	//This is the load order.
	//Dont add in between or the save file will not work anymore
	upgrades[upgradIndex] = new upgrade("Disk", "images/PC-disk/", 1, 10, 0.2, 10, 0); upgradIndex++;
	upgrades[upgradIndex] = new upgrade("Graphic Card", "images/PC-graphiccard/", 1, 10, 0.2, 10, 0); upgradIndex++;
	upgrades[upgradIndex] = new upgrade("Network", "images/PC-network/", 1, 10, 0.2, 10, 0); upgradIndex++;
	//Load pcs
	//Same as with upgrades
	pcs[pcIndex] = new pc("Start PC", "images/PC1.png", 0, true); pcIndex++;
	pcs[pcIndex] = new pc("Win98 PC", "images/blank.png", 1000, false); pcIndex++;
	pcs[pcIndex] = new pc("Win2001 PC", "images/blank.png", 50000, false); pcIndex++;

	initUpgrades();

	//click

	$('#Clicker').unbind().click(function(event) {
		clickPc();
	});

	$('.item').unbind().click(function(event) {
		HandleUpgradeClick(this.id);
	});

	$('.pc-container').unbind().click(function(event) {
		HandlePcClick(this.id);
	});

	//Handel ative and deative taps

	$(window).focus(function(event) {
		fps = targetFps;
		perLoop = calcPerLoop(perSec);
	});

	$(window).blur(function(event) {
		fps = 1;
		perLoop = calcPerLoop(perSec);
	});

	DrawPcs();
	GameLoop();
}

/* =========================================
Upgrades
========================================= */

function initUpgrades() {
	for (var i = 0; i < 3; i++) {
		items[i] = upgrades[i + i * pcLevel];
		DrawItem(i);
	}
}

function syncUpgrade() {
	for (var i = 0; i < 5; i++) {
		if (i + i * pcIndex >= upgrades.length || i >= items.length) continue;
		upgrades[i + i * pcIndex] = items[i];
	}	
}

function goToNextPc(index) {
	syncUpgrade();
	pcLevel = index;
	for (var i = 0; i < 5; i++) {
		if (i + i * pcIndex >= upgrades.length || i >= items.length) continue;
		items[i] = upgrades[i + i * pcLevel];
		DrawItem(i);
	}
}

/* =========================================
Click
========================================= */

function clickPc() {
	if (1000/fps*2 < new Date().getTime() - lastClick)  {
		money += perTap;
		TotalClick++;
		lastClick = new Date().getTime();
	}
	
}

function HandleUpgradeClick(id) {
	var num = parseInt(id.substr(id.length - 1)) - 1;
	if (num >= items.length) return;
	if (money >= items[num].cost) {
		money -= items[num].cost;
		perSec += items[num].base * Math.pow(1 + items[num].percent/100, items[num].bought);
		items[num].bought++;
		items[num].cost += items[num].cost *  items[num].percent/100;
		updateSec = 1;
		DrawItem(num);
	}
}

function HandlePcClick(id) {

}
		

/* =========================================
Calculation
========================================= */

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
		$('#' + strid).attr("src", 'images/blank.png');

	strid = "item" + (index+1) + "-name";
	$('#' + strid).text(items[index].name);
	strid = "item" + (index+1) + "-cost";
	$('#' + strid).text('Cost $ ' + parseFloat(items[index].cost).toFixed(3));
	strid = "item" + (index+1) + "-upgrade";
	$('#' + strid).text('$ ' + parseFloat(items[index].base * Math.pow(1 + items[index].percent/100, items[index].bought)).toFixed(3) + " per second");
}

function DrawPcs() {
	if (pcLevelDrawed < pcLevelUnlocked) {
		if (pcLevelUnlocked < pcs.length) {
			AppendPcHMTL(pcLevelDrawed+1);
			pcLevelDrawed++;
		}
	}
}

function AppendPcHMTL(index) {
	var cost = pcs[index].cost;
	if (pcs[index].owned) {
		cost = "Owned";
	}
	var pcID = index+1;

	var div = document.createElement('div');
	div.setAttribute('id', 'pc' + pcID); div.setAttribute('class', 'pc-container');

	var img = document.createElement('img');
	img.setAttribute('class', 'pc-img'); img.setAttribute('src', pcs[index].img);

	var pName = document.createElement('p');
	var pCost = document.createElement('p');

	pName.setAttribute('class', 'pc-name');
	var node = document.createTextNode(pcs[index].name);
	pName.appendChild(node);

	pCost.setAttribute('class', 'pc-cost'); pCost.setAttribute('id', 'pc' + pcID + '-cost');
	node = document.createTextNode('$ ' + pcs[index].cost);
	pCost.appendChild(node);

	div.appendChild(img);
	div.appendChild(pName);
	div.appendChild(pCost);

	document.getElementById('sidemenu').appendChild(div);

}


/* =========================================
Main logic 
========================================= */

GameLogic = function() {
	money += perLoop;


	/* ========== Unlocks ========== */


};

/* =========================================
Main game loop 
========================================= */

GameLoop = function() {
	if (updateSec == 1) {
		perLoop = perSec/fps;
	}
	if (2000 < new Date().getTime() - lastUpdate) {
		var title = "$ " + parseFloat(money).toFixed(3) + " | Hardware Clicker";
		document.title = title;
		lastUpdate = new Date().getTime();
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