var WFC_enemy = {};

WFC_enemy.scaleShield = function(level, base_level, base_shield) {
	return (base_shield * (1 + 0.0075 * Math.pow(level - base_level, 2)));
};
WFC_enemy.scaleHealth = function(level, base_level, base_health) {
	return (base_health * (1 + 0.015 * Math.pow(level - base_level, 2)));
};
WFC_enemy.scaleArmor = function(level, base_level, base_armor) {
	return (base_armor * (1 + 0.005 * Math.pow(level - base_level, 1.75)));
};

WFC_enemy.updateScaled = function() {
	
	
	var scaled_level = WFC_enemy.ref.scaled_level.value;
	var scaled_shield = WFC_enemy.scaleShield(scaled_level, 1, 100);
	WFC_enemy.ref.scaled_shield.innerHTML = (scaled_shield|0);
	WFC_enemy.ref.scaled_shield.title = scaled_shield;
	
	var scaled_health = WFC_enemy.scaleHealth(scaled_level, 1, 250);
	WFC_enemy.ref.scaled_health.innerHTML = (scaled_health|0);
	WFC_enemy.ref.scaled_health.title = scaled_health;
	
	var scaled_armor = WFC_enemy.scaleArmor(scaled_level, 1, 5);
	WFC_enemy.ref.scaled_armor.innerHTML = (scaled_armor|0);
	WFC_enemy.ref.scaled_armor.title = scaled_armor;
};

WFC_enemy.init = function() {
	WFC_enemy.enemy = {};
	WFC_enemy.ref = {
		"scaled_level" : document.getElementById("e_level"),
		"scaled_shield" : document.getElementById("e_shield"),
		"scaled_health" : document.getElementById("e_health"),
		"scaled_armor" : document.getElementById("e_armor"),
	};
	WFC_enemy.ref.scaled_level.onchange = WFC_enemy.updateScaled();
};

window.addEventListener("load", WFC_enemy.init);