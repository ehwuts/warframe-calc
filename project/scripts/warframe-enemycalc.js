var WFC_enemy = {};

WFC_enemy.scaleFactor = function(delta, base, coeff, exp) {
	return base * (1 + coeff * Math.pow(delta, exp));
};

WFC_enemy.updateDisplay = function() {	
	var stat = WFC_enemy.enemy.getShield();	
	WFC_enemy.ref.scaled_shield.innerHTML = (stat|0);
	WFC_enemy.ref.scaled_shield.title = stat;
	
	stat = WFC_enemy.enemy.getHealth();
	WFC_enemy.ref.scaled_health.innerHTML = (stat|0);
	WFC_enemy.ref.scaled_health.title = stat;
	
	stat = WFC_enemy.enemy.getArmor();
	WFC_enemy.ref.scaled_armor.innerHTML = (stat|0);
	WFC_enemy.ref.scaled_armor.title = stat;
};

WFC_enemy.updateEnemy 

WFC_enemy.init = function() {
	WFC_enemy.enemy = {
		"type" : {
			"faction" : "corpus",
			"shield" : "shield",
			"health" : "flesh",
			"armor" : "ferrite"
		},
		"base" : {
			"level" : 1,
			"shield" : 10,
			"health" : 250,
			"armor" : 5
		},
		"level" : 50,
		"getShield" : function() { return WFC_enemy.scaleFactor(WFC_enemy.enemy.level - WFC_enemy.enemy.base.level, WFC_enemy.enemy.base.shield, 0.0075, 2); },
		"getHealth" : function() { return WFC_enemy.scaleFactor(WFC_enemy.enemy.level - WFC_enemy.enemy.base.level, WFC_enemy.enemy.base.health, 0.015, 2); },
		"getArmor" : function() { return WFC_enemy.scaleFactor(WFC_enemy.enemy.level - WFC_enemy.enemy.base.level, WFC_enemy.enemy.base.armor, 0.005, 1.75); }
		
	};
	
	WFC_enemy.ref = {
		"base_level" : document.getElementById("base_level"),
		"base_shield" : document.getElementById("base_shield"),
		"base_health" : document.getElementById("base_health"),
		"base_armor" : document.getElementById("base_armor"),
		"scaled_level" : document.getElementById("scaled_level"),
		"scaled_shield" : document.getElementById("scaled_shield"),
		"scaled_health" : document.getElementById("scaled_health"),
		"scaled_armor" : document.getElementById("scaled_armor"),
		"select_enemy" : document.getElementById("select_enemy")
	};
	
	WFC_enemy.ref.base_level.onkeyup = function() { WFC_enemy.enemy.base.level = WFC_enemy.ref.base_level.value; WFC_enemy.updateDisplay(); };
	WFC_enemy.ref.scaled_level.onkeyup = function() { WFC_enemy.enemy.level = WFC_enemy.ref.scaled_level.value; WFC_enemy.updateDisplay(); };
	document.getElementById("select_load").onlick = WFC_enemy.updateEnemy();
	
	WFC_enemy.updateDisplay();
};

window.addEventListener("load", WFC_enemy.init);