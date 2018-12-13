if (!WFC) {
	WFC = {};
}
var WFC.Enemy = {};

WFC.Enemy.scaleFactor = function(delta, base, coeff, exp) {
	return base * (1 + coeff * Math.pow(delta, exp));
};

WFC.Enemy.updateDisplay = function() {	
	var stat = WFC.Enemy.enemy.getShield();	
	WFC.Enemy.ref.scaled_shield.innerHTML = (stat|0);
	WFC.Enemy.ref.scaled_shield.title = stat;
	
	stat = WFC.Enemy.enemy.getHealth();
	WFC.Enemy.ref.scaled_health.innerHTML = (stat|0);
	WFC.Enemy.ref.scaled_health.title = stat;
	
	stat = WFC.Enemy.enemy.getArmor();
	WFC.Enemy.ref.scaled_armor.innerHTML = (stat|0);
	WFC.Enemy.ref.scaled_armor.title = stat;
};

WFC.Enemy.updateEnemy 

WFC.Enemy.init = function() {
	WFC.Enemy.enemy = {
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
		"getShield"() { return WFC.Enemy.scaleFactor(WFC.Enemy.enemy.level - WFC.Enemy.enemy.base.level, WFC.Enemy.enemy.base.shield, 0.0075, 2); },
		"getHealth"() { return WFC.Enemy.scaleFactor(WFC.Enemy.enemy.level - WFC.Enemy.enemy.base.level, WFC.Enemy.enemy.base.health, 0.015, 2); },
		"getArmor"() { return WFC.Enemy.scaleFactor(WFC.Enemy.enemy.level - WFC.Enemy.enemy.base.level, WFC.Enemy.enemy.base.armor, 0.005, 1.75); }
		
	};
	
	WFC.Enemy.ref = {
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
	
	WFC.Enemy.ref.base_level.onkeyup = function() { WFC.Enemy.enemy.base.level = WFC.Enemy.ref.base_level.value; WFC.Enemy.updateDisplay(); };
	WFC.Enemy.ref.scaled_level.onkeyup = function() { WFC.Enemy.enemy.level = WFC.Enemy.ref.scaled_level.value; WFC.Enemy.updateDisplay(); };
	document.getElementById("select_load").onlick = WFC.Enemy.updateEnemy();
	
	WFC.Enemy.updateDisplay();
};

window.addEventListener("load", WFC.Enemy.init);