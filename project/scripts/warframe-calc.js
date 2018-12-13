var WFC = {};

//{ polarity: ' ', mod: null, rank: '' }
var slots = [];
var slotsCount = 8;
var filter = "";

var rivenEffects = {};
var statsum = {};

function percentagestringFromFloat(f, p = 1) {
	f *= 100;
	if (f > 0) {
		f += 0.00001;
	} else {
		f -= 0.00001;
	}
	/*let r = (f + ' ').substring(0, 3);
	if (r[2] == '.') {
		r = r.substring(0, 2);
	}
	return r + '%';*/
	return f.toFixed(p) + "%";
}
function truncatedstringFromFloat(f, p = 2) {
	if (f > 0) {
		f += 0.00001;
	} else {
		f -= 0.00001;
	}
	/*let r = (f + ' ').substring(0, 4);
	return r;
	*/
	return f.toFixed(p);
}
function modCostFromSlot(i) {
	var id = slots[i].mod;
	if (id) {
		let costadj = (slots[i].rank|0)+WFC.SharedData.Mods[id].cost;
		costadj = (slots[i].polarity!=" "?Math.ceil(slots[i].polarity==WFC.SharedData.Mods[id].polarity?costadj/2.0:costadj*1.25):costadj);

		return costadj;
	}
	return 0;
}

function clearFiltering() {
	console.log("Call to remove filter");
}
function applyFiltering() {
	console.log("Call to change filter to: " +  filter);
}

function updateFiltering(e) {
	var newfilter = e.target.value;
	if (filter != newfilter) {
		filter = newfilter;
		if (newfilter === "") {
			clearFiltering();
		} else {
			applyFiltering();
		}
	}
}


function updateDamageCalcs() {
	var v = document.getElementById("output");
	
	if (!WFC.SharedData.Weapon) {
		v.innerHTML = "";
		return;
	}
	

	var stats = JSON.parse(JSON.stringify(WFC.SharedData.Weapon.Attacks[Object.keys(WFC.SharedData.Weapon.Attacks)[0]]));
	var baseDamage = 0;
	{
		let k = Object.keys(stats.Damage);
		for (let i = 0; i < k.length; i++) {
			baseDamage += stats.Damage[k[i]];
		}
	}

	var getStatusTickDamage = {
		"damageImpact": () => {return 0},
		"damagePuncture": () => {return 0},
		"damageSlash": () => {return 0.35 * baseDamage * damagePercentsFinal.damageSlash},
		"damageSlash2": () => {return 0.35 * baseDamage * (1 + damagePercentsFinal.damageSlash)},
		"damageCold": () => {return 0},
		"damageElectricity": () => {return 0.5 * baseDamage * (1 + damagePercentsFinal.damageElectricity)},
		"damageHeat": () => {return 0.5 * baseDamage * (1 + damagePercentsFinal.damageHeat)},
		"damageToxin": () => {return 0.5 * baseDamage * (1 + damagePercents.damageToxin)},
		"damageToxin2": () => {return 0.25 * baseDamage * (1 + damagePercents.damageToxin) * (1 + damagePercents.damageToxin)},
		"damageBlast": () => {return 0},
		"damageCorrosive": () => {return 0},
		"damageGas": () => {return 0.5 * baseDamage * damagePercentsFinal.damageToxin},
		"damageMagnetic": () => {return 0},
		"damageRadiation": () => {return 0},
		"damageViral": () => {return 0},
	};

	function getCompound(a, b) {
		var compounds = [["damageCold", "damageHeat", "damageBlast"],
						 ["damageElectricity", "damageToxin", "damageCorrosive"],
						 ["damageHeat", "damageToxin", "damageGas"],
						 ["damageCold", "damageElectricity", "damageMagnetic"],
						 ["damageHeat", "damageElectricity", "damageRadiation"],
						 ["damageCold", "damageToxin", "damageViral"]];
		for (let i = 0; i < compounds.length; i++) {
			if ((compounds[i][0] == a && compounds[i][1] == b) || (compounds[i][1] == a && compounds[i][0] == b)) return compounds[i][2];
		}
		return false;
	}

	var elementTransductions = {};
	{
		let elementalPriority = [];
		let k = Object.keys(statsum);
		for (let i = 0; i < k.length; i++) {
			switch (k[i]) {
				case "bonusCold":
					elementalPriority.push("damageCold");
					break;
				case "bonusHeat":
					elementalPriority.push("damageHeat");
					break;
				case "bonusToxin":
					elementalPriority.push("damageToxin");
					break;
				case "bonusElectricity":
					elementalPriority.push("damageElectricity");
					break;
				default:
			}
		}
		if (stats.Damage.Cold && ! elementalPriority.includes("damageCold")) elementalPriority.push("damageCold");
		if (stats.Damage.Heat && ! elementalPriority.includes("damageHeat")) elementalPriority.push("damageHeat");
		if (stats.Damage.Toxin && ! elementalPriority.includes("damageToxin")) elementalPriority.push("damageToxin");
		if (stats.Damage.Electricity && ! elementalPriority.includes("damageElectricity")) elementalPriority.push("damageElectricity");
		//console.log(elementalPriority);

		for (let i = 0; i < elementalPriority.length - 1; i++) {
			let k = getCompound(elementalPriority[i], elementalPriority[i+1]);
			if (k) {
				elementTransductions[elementalPriority[i]] = [[k, 1]];
				elementTransductions[elementalPriority[i + 1]] = [[k, 1]];
				i++;
			}
		}
	}


	var damagePercents = {
		"damageImpact": 0,
		"damagePuncture": 0,
		"damageSlash": 0,
		"damageCold": 0,
		"damageElectricity": 0,
		"damageHeat": 0,
		"damageToxin": 0,
		"damageBlast": 0,
		"damageCorrosive": 0,
		"damageGas": 0,
		"damageMagnetic": 0,
		"damageRadiation": 0,
		"damageViral": 0
	};
	var damagePercentsFinal = {
		"damageImpact": 0,
		"damagePuncture": 0,
		"damageSlash": 0,
		"damageCold": 0,
		"damageElectricity": 0,
		"damageHeat": 0,
		"damageToxin": 0,
		"damageBlast": 0,
		"damageCorrosive": 0,
		"damageGas": 0,
		"damageMagnetic": 0,
		"damageRadiation": 0,
		"damageViral": 0
	};
	var statusEffectBaseDuration = {
		"damageImpact": 1,
		"damagePuncture": 6,
		"damageSlash": 6,
		"damageCold": 6,
		"damageElectricity": 3,
		"damageHeat": 6,
		"damageToxin": 8,
		"damageBlast": 2,
		"damageCorrosive": 8,
		"damageGas": 8 / 16,
		"damageMagnetic": 4,
		"damageRadiation": 12,
		"damageViral": 6
	};

	function applyTransducedPercent(key, percent, table = damagePercentsFinal) {
		//console.log('Transducing ' + key + ' ' + percentagestringFromFloat(percent));
		if (elementTransductions[key]) {
			for (let i = 0; i < elementTransductions[key].length; i++) {
				table[elementTransductions[key][i][0]] += percent * elementTransductions[key][i][1];
			}
		} else {
			table[key] += percent;
		}
	}

	{
		let k = Object.keys(stats.Damage);
		for (let i = 0; i < k.length; i++) {
			damagePercents["damage" + k[i]] += stats.Damage[k[i]] / baseDamage;
		}
	}

	var critChance = stats.CriticalChance * (1 + (statsum.bonusCritChance?statsum.bonusCritChance:0)) + (statsum.flatCritChance?statsum.flatCritChance:0);
	var critMulti = stats.CriticalMultiplier * (1 + (statsum.bonusCritDamage?statsum.bonusCritDamage:0));
	var multishot = stats.Projectiles * (1 + (statsum.bonusMultishot?statsum.bonusMultishot:0));
	var punchThrough = stats.PunchThrough + (statsum.flatPunchThrough?statsum.flatPunchThrough:0);
	var fireRate = (stats.Trigger == "triggerCharge" ? 1 / stats.ChargeTime : stats.FireRate) *(1 + (statsum.bonusFireRate?statsum.bonusFireRate:0));
	var magazine = WFC.SharedData.Weapon.Magazine * (1 + (statsum.bonusMagazine?statsum.bonusMagazine:0));
	var reload = WFC.SharedData.Weapon.Reload * (1 + (statsum.bonusReload?statsum.bonusReload:0));
	var ammo = WFC.SharedData.Weapon.Ammo * (1 + (statsum.bonusAmmo?statsum.bonusAmmo:0));
	if (statsum.bonusCold) damagePercents["damageCold"] += statsum.bonusCold;
	if (statsum.bonusElectricity) damagePercents["damageElectricity"] += statsum.bonusElectricity;
	if (statsum.bonusHeat) damagePercents["damageHeat"] += statsum.bonusHeat;
	if (statsum.bonusToxin) damagePercents["damageToxin"] += statsum.bonusToxin;
	if (statsum.bonusImpact) damagePercents["damageImpact"] *= (1 + statsum.bonusImpact);
	if (statsum.bonusPuncture) damagePercents["damagePuncture"]  *= (1 + statsum.bonusPuncture);
	if (statsum.bonusSlash) damagePercents["damageSlash"]  *= (1 + statsum.bonusSlash);
	var statusChance =  1 - Math.pow(1 - stats.StatusChance * (1 + (statsum.bonusStatusChance?statsum.bonusStatusChance:0)), 1 / stats.Projectiles);
	var statusDuration = 1 + (statsum.bonusStatusDuration?statsum.bonusStatusDuration:0);

	function critScale(tier, multi) {
		return tier * (multi - 1) + 1;
	}
	//            tier, chance, multi
	var crits = [[Math.floor(critChance), Math.floor(critChance) + 1 - critChance, critScale(Math.floor(critChance), critMulti)]];
	crits[1]  =  [crits[0][0] + 1, 1 - crits[0][1], critScale(crits[0][0] + 1, critMulti)];

	var vigilanteChance = (statsum.setVigilante?(statsum.setVigilante) * 0.05:0);
	crits[2] = [crits[1][0] + 1, vigilanteChance * crits[1][1], critScale(crits[0][0] + 2, critMulti)];
	crits[0][1] = crits[0][1] * (1 - vigilanteChance);
	crits[1][1] = (1 - crits[2][1] - crits[0][1]);
	while (crits.length > 0 && crits[crits.length - 1][1] == 0) crits.pop();

	var critAvg = 0;
	var critAvgHead = 0;
	var descCritSpread = "LOCALIZEME<br>";
	for (let i = 0; i < crits.length; i++) {
		critAvg += crits[i][1] * crits[i][2];
		critAvgHead += crits[i][1] * crits[i][2] * 2 * (crits[i][0] > 0?2:1);
		descCritSpread += percentagestringFromFloat(crits[i][1]) + " chance of Tier " + crits[i][0] + " crit for " + truncatedstringFromFloat(crits[i][2]) + "x damage.<br>";
	}
	descCritSpread += "Average effect from crits: " + truncatedstringFromFloat(critAvg) + "x<br>Average multiplier for headshots: " + truncatedstringFromFloat(critAvgHead) + "x";

	var clipUseTime = magazine / fireRate;
	var firingPercent = clipUseTime / (clipUseTime + reload);
	var ammoEmptyTime = ammo / magazine * (clipUseTime + reload);

	var descFiring = "LOCALIZEME<br>";
	descFiring += "Time to empty magazine: " + truncatedstringFromFloat(clipUseTime) + " seconds.<br>";
	descFiring += "Percentage of time spent firing: " + percentagestringFromFloat(firingPercent) + ".<br>";
	descFiring += "Time to out of ammo: " + truncatedstringFromFloat(ammoEmptyTime) + " seconds.";

	var statusPool = 0;
	{
		var k = Object.keys(damagePercents);
		for (let i = 0; i < k.length; i++) {
			if (damagePercents[k[i]] < 0) {
				damagePercents[k[i]] = 0;
			}
			statusPool += damagePercents[k[i]];
		}
	}
	statusPool += (damagePercents.damageImpact + damagePercents.damagePuncture + damagePercents.damageSlash) * 3;

	baseDamage *= (1 + (statsum.bonusDamage?statsum.bonusDamage:0));

	var damageBases = {};
	var statusPercentages = {};
	var statusChancePerShot = {};
	var statusUptimeClip = {};
	var statusUptimeSustained = {};
	var statusEffectScaledDuration = {};
	var statusPerSecond = {};
	var damageMinimum = {};
	var damageScaled = {};
	//console.log(Math.floor(multishot + 0.00000001));
	//console.log(crits[0][2]);

	var damageSumPercent = 0;
	var k = Object.keys(damagePercents);
	for (let i = 0; i < k.length; i++) {
		applyTransducedPercent(k[i], damagePercents[k[i]]);
		damageSumPercent += damagePercentsFinal[k[i]];
		damageBases[k[i]] = damagePercentsFinal[k[i]] * baseDamage;
		statusPercentages[k[i]] = damagePercentsFinal[k[i]] / statusPool;
		if (k[i] == "damageImpact" || k[i] == "damagePuncture" || k[i] == "damageSlash") statusPercentages[k[i]] *= 4;
		damageMinimum[k[i]] = damageBases[k[i]] * Math.floor(multishot + 0.00000001) * crits[0][2];
		damageScaled[k[i]] = damageBases[k[i]] * multishot * critAvg;
		statusChancePerShot[k[i]] = statusChance * statusPercentages[k[i]];
		statusEffectScaledDuration[k[i]] = statusEffectBaseDuration[k[i]] * statusDuration;
		statusPerSecond[k[i]] = statusChancePerShot[k[i]] * multishot * fireRate;
		statusUptimeClip[k[i]] = statusPerSecond[k[i]] / (1 / statusEffectScaledDuration[k[i]]);
		statusUptimeSustained[k[i]] = Math.min(1, statusUptimeClip[k[i]] * firingPercent);
		statusUptimeClip[k[i]] = Math.min(1, statusUptimeClip[k[i]]);
	}

	var statusDesc = {
		"damageImpact": "LOCALIZEME Staggers the target for " + truncatedstringFromFloat(statusEffectScaledDuration["damageImpact"]) + " seconds.",
		"damagePuncture": "LOCALIZEME Reduces damage dealt by the target by 70% for " + truncatedstringFromFloat(statusEffectScaledDuration["damagePuncture"]) + " seconds.",
		"damageSlash": "LOCALIZEME Deals " + truncatedstringFromFloat(getStatusTickDamage["damageSlash"]()) + " True damage to the target immediately plus " + truncatedstringFromFloat(getStatusTickDamage["damageSlash"]()) + " True damage each second for " + truncatedstringFromFloat(statusEffectScaledDuration["damageSlash"]) + " seconds.",
		"damageCold": "LOCALIZEME Reduces the target\"s movement speed, fire rate, and attack speed to half for " + truncatedstringFromFloat(statusEffectScaledDuration["damageCold"]) + " seconds.",
		"damageElectricity": "LOCALIZEME Stuns the target for " + truncatedstringFromFloat(statusEffectScaledDuration["damageElectricity"]) + " seconds, and deals " + truncatedstringFromFloat(getStatusTickDamage["damageElectricity"]()) + " Electricity damage to the target and enemies within 3 meters of the target.",
		"damageHeat": "LOCALIZEME Causes the target to panic and deals " + truncatedstringFromFloat(getStatusTickDamage["damageHeat"]()) + " Heat damage immediately plus " + truncatedstringFromFloat(getStatusTickDamage["damageHeat"]()) + "Heat damage per second for " + truncatedstringFromFloat(statusEffectScaledDuration["damageHeat"]) + " seconds. Does not stack.",
		"damageToxin": "LOCALIZEME Deals " + truncatedstringFromFloat(getStatusTickDamage["damageToxin"]()) + " Toxin damage immediately plus " + truncatedstringFromFloat(getStatusTickDamage["damageToxin"]()) + " Toxin damage per second for " + truncatedstringFromFloat(statusEffectScaledDuration["damageToxin"]) + " seconds.",
		"damageBlast": "LOCALIZEME Knocks down enemies within 5 meters of the target for an estimated " + truncatedstringFromFloat(statusEffectScaledDuration["damageBlast"]) + " seconds.",
		"damageCorrosive": "LOCALIZEME Permanently reduces the target\"s current armor by 25%.",
		"damageGas": "LOCALIZEME Deals " + truncatedstringFromFloat(getStatusTickDamage["damageGas"]()) + " Toxin damage to all enemies within 3 meters of the target, and applies a Toxin status effect to each enemy hit.",
		"damageMagnetic": "LOCALIZEME Temporarily reduces target\"s maximum shields by 75% for " + truncatedstringFromFloat(statusEffectScaledDuration["damageMagnetic"]) + " seconds.",
		"damageRadiation": "LOCALIZEME Makes target attack and be attacked by enemies for " + truncatedstringFromFloat(statusEffectScaledDuration["damageRadiation"]) + " seconds.",
		"damageViral": "LOCALIZEME Temporarily halves target health, making them take effectively doubled damage for " + truncatedstringFromFloat(statusEffectScaledDuration["damageViral"]) + " seconds."
	};

	var dpsShot = baseDamage * damageSumPercent * multishot * critAvg;
	var dpsClip = dpsShot * fireRate;
	var dpsSustained = dpsClip * firingPercent;


	/* Begin Display Blob */
	var result = "<table>" + "\n"
	           + "<tr><td colspan=\"4\">" + WFC.SharedData.Weapon.Name + " - " + Object.keys(WFC.SharedData.Weapon.Attacks)[0] + "</td></tr>"
			   + "<tr><td colspan=\"4\">" + WFC.Translate.translate(WFC.SharedData.Weapon.Group) + ", " + WFC.Translate.translate(WFC.SharedData.Weapon.SubGroup) + "</td></tr>";

	result += "<tr><td>&nbsp;</td><td>" + WFC.Translate.translate("labelBase") + "<td>" + WFC.Translate.translate("labelMinimum") + "</td><td>" + WFC.Translate.translate("labelAverage") + "</td><td>" + WFC.Translate.translate("statStatusChance") + "</td></tr>" + "\n";
	var k = Object.keys(damagePercents);
	for (let i = 0; i < k.length; i++) {
		if (damageBases[k[i]]) result += "<tr><td>" + WFC.Translate.translate(k[i]) + "</td><td>" + truncatedstringFromFloat(damageBases[k[i]]) + "</td><td>" + truncatedstringFromFloat(damageMinimum[k[i]]) + "</td><td>" + truncatedstringFromFloat(damageScaled[k[i]]) + "</td><td>" + percentagestringFromFloat(statusChancePerShot[k[i]]) + "</td></tr>" + "\n";
	}
	result += "<tr><td colspan=\"4\">&nbsp;</td></tr>" + "\n";

	result += "<tr><td>" + WFC.Translate.translate("statCritChance") + "</td><td>" + percentagestringFromFloat(critChance) + "</td><td rowspan=\"4\" colspan=\"2\">" + descCritSpread + "</td></tr>" + "\n"
	        + "<tr><td>" + WFC.Translate.translate("statCritDamage") + "</td><td>" + truncatedstringFromFloat(critMulti) + "x</td></tr>" + "\n"
	        + "<tr><td>" + WFC.Translate.translate("statMultishot") + "</td><td>" + truncatedstringFromFloat(multishot) + "</td></tr>" + "\n"
	        + "<tr><td>" + WFC.Translate.translate("statStatusChance") + "</td><td>" + percentagestringFromFloat(statusChance) + "</td></tr>" + "\n";
	if (statusDuration != 1) result += "<tr><td>" + WFC.Translate.translate("statStatusDuration") + "</td><td>" + percentagestringFromFloat(statusDuration) + "</td></tr>" + "\n"
	if (punchThrough) result += "<tr><td>" + WFC.Translate.translate("statPunchThrough") + "</td><td>" + truncatedstringFromFloat(punchThrough) + "</td></tr>" + "\n";
	if (stats.trigger == "triggerCharge") result += "<tr><td>" + WFC.Translate.translate("statChargeRate") + "</td><td>" + truncatedstringFromFloat(1 / fireRate) + "</td></tr>" + "\n";
	result += "<tr><td>" + WFC.Translate.translate("statFireRate") + "</td><td>" + truncatedstringFromFloat(fireRate) + "</td></tr>" + "\n";
	result += "<tr><td>" + WFC.Translate.translate("statMagazine") + "</td><td>" + truncatedstringFromFloat(magazine) + "</td><td colspan=\"2\" rowspan=\"3\">" + descFiring + "</td></tr>" + "\n"
	        + "<tr><td>" + WFC.Translate.translate("statReload") + "</td><td>" + truncatedstringFromFloat(reload) + "</td></tr>" + "\n"
	        + "<tr><td>" + WFC.Translate.translate("statAmmo") + "</td><td>" + truncatedstringFromFloat(ammo) + "</td></tr>" + "\n"
	        + "<tr><td colspan=\"4\">&nbsp;</td></tr>" + "\n"
			+ "<tr><td>" + WFC.Translate.translate("labelDpsShot") + "</td><td>" + truncatedstringFromFloat(dpsShot) + "</td></tr>" + "\n"
			+ "<tr><td>" + WFC.Translate.translate("labelDpsClip") + "</td><td>" + truncatedstringFromFloat(dpsClip) + "</td></tr>" + "\n"
			+ "<tr><td>" + WFC.Translate.translate("labelDpsSustained") + "</td><td>" + truncatedstringFromFloat(dpsSustained) + "</td></tr>" + "\n"
			;
	if (statusChance > 0) {
		result += "<tr><td colspan=\"4\">&nbsp;</td></tr>" + "\n"
		        + "<tr><td>" + WFC.Translate.translate("labelStatusType") + "</td><td>" + WFC.Translate.translate("labelStatusPerSecondClip") + "</td><td>" + WFC.Translate.translate("statStatusDuration") + "</td><td>" + WFC.Translate.translate("labelStatusUptimeClip") + "</td><td>" + WFC.Translate.translate("labelStatusResult") + "</td></tr>";
		let k = Object.keys(damagePercents);
		for (let i = 0; i < k.length; i++) {
			if (damageBases[k[i]]||(k[i]=="damageToxin"&&damageBases["damageGas"])) result += "<tr><td>" + WFC.Translate.translate(k[i]) + "</td><td>" + truncatedstringFromFloat(statusPerSecond[k[i]]) + "</td><td>" + truncatedstringFromFloat(statusEffectScaledDuration[k[i]]) + "</td><td>" + percentagestringFromFloat(statusUptimeClip[k[i]]) + "</td><td>" + statusDesc[k[i]] + "</td></tr>" + "\n";
		}
	}
	result += "</table>";
	/* End Display Blob */

	v.innerHTML = result;
}

function updateStatsum() {
	var newStatsum = {};
	var capacitySum = 0;

	for (var m = 0; m < slots.length; m++) {
		if (slots[m].mod && WFC.SharedData.Mods[slots[m].mod]) {
			let mod = WFC.SharedData.Mods[slots[m].mod];
			let effects = (mod.sharedID && mod.sharedID == "modRiven" ? rivenEffects : mod.effects);
			let k = Object.keys(effects);
			if (mod.sharedID && mod.sharedID == "modRiven") k.reverse();
			for (let i = 0; i < k.length; i++) {
				let adj = effects[k[i]] * (slots[m].rank + 1);
				if (newStatsum[k[i]]) {
					newStatsum[k[i]] += adj;
				} else {
					newStatsum[k[i]] = adj;
				}
			}
			if (mod.set) {
				if (newStatsum[mod.set]) {
					newStatsum[mod.set] ++;
				} else {
					newStatsum[mod.set]  = 1;
				}
			}
			capacitySum += modCostFromSlot(m);
		}
	}

	var zoom = document.getElementById("zoom").value;
	if (zoom !== "" && WFC.SharedData.Weapon.Zoom && WFC.SharedData.Weapon.Zoom[zoom]) {
		let k = Object.keys(WFC.SharedData.Weapon.Zoom[zoom].Effects);
		//console.log(k);
		for (let i = 0; i < k.length; i++) {
			if (newStatsum[k[i]]) {
				newStatsum[k[i]] += WFC.SharedData.Weapon.Zoom[zoom].Effects[k[i]];
			} else {
				newStatsum[k[i]] = WFC.SharedData.Weapon.Zoom[zoom].Effects[k[i]];
			}
		}
	}

	statsum = newStatsum;
	//document.getElementById('testdiv').innerHTML = JSON.stringify(statsum,null,2);

	document.getElementById("capacity").innerText = capacitySum + "/60";

	if (WFC.SharedData.Weapon) {
		updateDamageCalcs();
	}
}

function describeMod(id, rank = null) {
	var result = "";
	var mod = WFC.SharedData.Mods[id];
	if (mod) {
		if (!rank) {
			rank = 0;
		}
		rank = Math.max(0, Math.min(mod.ranks, rank));

		let effects = (mod.sharedID && mod.sharedID == "modRiven" ? rivenEffects : mod.effects);
		var k = Object.keys(effects);
		for (let i = 0; i < k.length; i++) {
			let adj = effects[k[i]] * (rank + 1);
			result += (adj>0?"+":"") + (k[i].indexOf("bonus") === 0?percentagestringFromFloat(adj,0):truncatedstringFromFloat(adj))  + " " + WFC.Translate.translate(k[i]) + "<br>";
		}
		if (mod.set) {
			result += WFC.Translate.translate(mod.set);
		}
	}
	return result;
}

function slotAdjust(slot, delta) {
	var i = slot.getAttribute("data-num");
	var id = slots[i].mod;
	slots[i].rank = Math.max(0, Math.min(WFC.SharedData.Mods[id].ranks, slots[i].rank + delta));
	slot.children[0].children[1].innerText = slots[i].rank+"/"+WFC.SharedData.Mods[id].ranks;

	let costadj = modCostFromSlot(i);
	slot.children[2].innerText = costadj + " " + WFC.SharedData.Mods[id].polarity;
	slot.children[4].innerHTML = describeMod(id, slots[i].rank);

	updateStatsum();
}

function displayRivenEditor() {
	for (let i = 0; i < slots.length; i++) {
		if (slots[i].mod && WFC.SharedData.Mods[slots[i].mod] && WFC.SharedData.Mods[slots[i].mod].sharedID && WFC.SharedData.Mods[slots[i].mod].sharedID == "modRiven") {
			document.getElementById("rivenedit").classList.remove("hide2");
			return;
		}
	}
	document.getElementById("rivenedit").classList.add("hide2");
	return;
}

function setSlot(slot, id, rank = null) {
	var i = slot.getAttribute("data-num");
	if (id) {
		if (rank !== null) {
			slots[i].rank = rank;
		} else {
			slots[i].rank = WFC.SharedData.Mods[id].ranks;
		}
		slots[i].mod = id;
		let polarmatch = (slots[i].polarity!=" "?(slots[i].polarity==WFC.SharedData.Mods[id].polarity?" polaritymatch":" polarityconflict"):"");
		let costadj = modCostFromSlot(i);

		slot.children[0].className = "slotrank";
		slot.children[0].children[1].innerText = slots[i].rank+"/"+WFC.SharedData.Mods[id].ranks;
		slot.children[1].innerText = slots[i].polarity;
		slot.children[2].className = "slotcost" + polarmatch;
		slot.children[2].innerText = costadj + " " + WFC.SharedData.Mods[id].polarity;
		slot.children[3].innerText = WFC.Translate.translate(WFC.SharedData.Mods[id].id);
		slot.children[4].innerHTML = describeMod(id, slots[i].rank);
		slot.children[5].innerText = WFC.Translate.translate(WFC.SharedData.Mods[id].tag);
		slot.draggable=true;
	} else {
		slots[i] = { polarity: slots[i].polarity, mod: null, rank: null };
		slot.children[0].className = "slotrank hide";
		slot.children[1].innerText = slots[i].polarity;
		slot.children[2].className = "slotcost";
		slot.children[2].innerText = "";
		slot.children[3].innerText = "";
		slot.children[4].innerText = "";
		slot.children[5].innerText = "";
		slot.draggable = null;
	}

	displayRivenEditor();
	updateStatsum();
}

function swapSlots(a, b) {
	var i = slots[a.getAttribute("data-num")].mod;
	var ir = slots[a.getAttribute("data-num")].rank;
	setSlot(a, slots[b.getAttribute("data-num")].mod, slots[b.getAttribute("data-num")].rank);
	setSlot(b, i, ir);
}

function makeListVisible(id) {
	var search = document.querySelector('#modslist [data-modid="'+id+'"]');
	if (search) {
		search.classList.remove("hide2");
	}
}
function makeListInvisible(id) {
	var search = window.document.querySelector('#modslist [data-modid="'+id+'"]');
	if (search) {
		search.classList.add("hide2");
	}
}

var DragHandler = (function(window, undefined){
	var dragSrc = null;

	return {
		"enter": function handleDragEnter(e) {
			this.classList.add("over");
		},
		"start": function handleDragStart(e) {
			dragSrc = this;
			//console.log(this);

			e.dataTransfer.effectAllowed = "move";
		},
		"over": function handleDragOver(e) {
			if (e.preventDefault) {
				e.preventDefault();
			}

			e.dataTransfer.dropEffect = "move";

			return false;
		},
		"leave": function handleDragLeave(e) {
			this.classList.remove("over");
		},
		"drop": function handleDrop(e) {
			if (e.stopPropogation) {
				e.stopPropogation();
			}

			if (dragSrc != this && (dragSrc.classList.contains("slot") || this.classList.contains("slot"))) {
				if (dragSrc.parentElement.id == "modslist") {
					if (slots[this.getAttribute("data-num")].mod) {
						makeListVisible(slots[this.getAttribute("data-num")].mod);
					} else {
						for (let i = 0; i < slots.length; i++) {
							let conflicts = WFC.SharedData.Mods[dragSrc.getAttribute('data-modid')].sharedID;
							let conflicts2 = slots[i].mod && WFC.SharedData.Mods[slots[i].mod].sharedID;
							if (conflicts2 && conflicts && conflicts2 == conflicts) {
								return false;
							}
						}
					}
					setSlot(this, dragSrc.getAttribute("data-modid"));
					dragSrc.classList.add("hide2");
				} else if (this.parentElement.id == "modslist" || this.id == "modslist") {
					makeListVisible(slots[dragSrc.getAttribute("data-num")].mod);
					setSlot(dragSrc, null);
				} else {
					swapSlots(dragSrc, this);
				}
			}

			return false;
		},
		"end": function handleDragEnd(e) {
			var tiles = document.querySelectorAll(".over");
			[].forEach.call(tiles, (tile) => {
				tile.classList.remove("over");
			});

			dragSrc = null;
		}
	};
})(window);

function reloadSlots() {
	var ss = document.getElementById("slots").children;
	for (let i = 0; i < slots.length; i++) {
		setSlot(ss[i], slots[i].mod, slots[i].rank);
	}
}

function sortModsList() {
	var a = [];
	var p = document.getElementById("modslist").children;
	for (let i = 0; i < p.length; i++) {
		let mod = p[i].getAttribute("data-modid");
		a.push({id: mod, hide: p[i].classList.contains("hide2"), val: WFC.Translate.translate(WFC.SharedData.Mods[mod].id)});
	}
	a.sort((x, y) => (x.val>y.val?1:-1));
	for (let i = 0; i < a.length; i++) {
		p[i].setAttribute("data-modid", a[i].id);
		p[i].innerText = a[i].val;
		p[i].id = WFC.SharedData.Mods[a[i].id].id;
		if (a[i].hide) {
			makeListInvisible(a[i].id);
		} else {
			makeListVisible(a[i].id);
		}
	}
}

function initializeModsList() {
	var k = Object.keys(WFC.SharedData.Mods);
	var dest = document.getElementById("modslist");

	for (let i = 0; i < k.length; i++) {
		let e = document.createElement("div");
		e.setAttribute("data-modid", k[i]);
		e.id = WFC.SharedData.Mods[k[i]].id;

		e.classList.add("tile");
		e.draggable = true;
		e.innerText = WFC.Translate.translate(WFC.SharedData.Mods[k[i]].id);

		e.addEventListener("dragstart", DragHandler.start, false);
		e.addEventListener("dragend", DragHandler.end, false);

		dest.appendChild(e);
		
		WFC.Translate.add(e.id, e.id, "innerText");
	}
	dest.addEventListener("dragover", DragHandler.over, false);
	dest.addEventListener("dragleave", DragHandler.leave, false);
	dest.addEventListener("dragend", DragHandler.end, false);
	dest.addEventListener("drop", DragHandler.drop, false);

	sortModsList();

	document.getElementById("modfilter").onchange = updateFiltering;
	document.getElementById("modfilter").onkeyup = updateFiltering;
}

function reinitializeModsList() {
	var m = document.getElementById("modslist");
	while (m.children.length > 0) {
		m.removeChild(m.lastElementChild);
	}
	initializeModsList();
	for (let i = 0; i < slots.length; i++) {
		if (slots[i].mod) {
			makeListInvisible(slots[i].mod);
		}
	}
}

function cyclePolarity(e) {
	var slot = e.target.parentElement;
	var id = slot.getAttribute("data-num");

	var polarities = [" ", "V", "D", "—", "=", "R", "Y", "U"];
	var polarityCycle = polarities[(polarities.indexOf(slots[id].polarity) + 1) % polarities.length];

	slots[id].polarity = polarityCycle;
	setSlot(slot, slots[id].mod, slots[id].rank);
}

function initializeModSlots() {
	for (let i = 0; i < slotsCount; i++) {
		slots[i] = { polarity: " ", mod: null, rank: "" };
	}

	var dest = document.getElementById("slots");
	for (let i = 0; i < slots.length; i++) {
		let e = document.createElement("div");
		e.classList.add("slot");
		e.setAttribute("data-num", i);

		e.addEventListener("dragstart", DragHandler.start, false);
		e.addEventListener("dragenter", DragHandler.enter, false);
		e.addEventListener("dragover", DragHandler.over, false);
		e.addEventListener("dragleave", DragHandler.leave, false);
		e.addEventListener("dragend", DragHandler.end, false);
		e.addEventListener("drop", DragHandler.drop, false);

		let ee = document.createElement("div");
		ee.className = "slotrank hide";
		let eee = document.createElement("button");
		eee.innerText = "-";
		eee.onclick = (e) => slotAdjust(e.target.parentElement.parentElement, -1);
		ee.appendChild(eee);
		eee = document.createElement("span");
		eee.innerText = "0/0";
		ee.appendChild(eee);
		eee = document.createElement("button");
		eee.innerText = "+";
		eee.onclick = (e) => slotAdjust(e.target.parentElement.parentElement, 1);
		ee.appendChild(eee);
		e.appendChild(ee);

		ee = document.createElement("div");
		ee.className = "slotpolarity";
		ee.innerText = " ";
		ee.onclick = cyclePolarity;
		e.appendChild(ee);

		ee = document.createElement("div");
		ee.className = "slotcost";
		e.appendChild(ee);

		ee = document.createElement("div");
		ee.className = "slotname";
		e.appendChild(ee);

		ee = document.createElement("div");
		ee.className = "sloteffects";
		e.appendChild(ee);

		ee = document.createElement("div");
		ee.className = "slotcategory";
		e.appendChild(ee);

		dest.appendChild(e);
	}
}

function displayItem() {
	if (item === -1 || !items.hasOwnProperty(item)) {
		document.getElementById("displayItem").innerText = "";
		return;
	}
	return;

	var v = document.getElementById("displayItem");
	var tags = [];
	for (let i = 0; i < items[item].type.length; i++) {
		tags.push(WFC.Translate.translate(items[item].type[i]));
	}

	v.innerText = items[item].name + "\n"
	            + tags.join(', ') + "\n\n";
	v.innerText += 'Attacks' + "\n";
	for (let i = 0; i < items[item].attacks.length; i++) {
		v.innerText += items[item].attacks[i].attackName + "\n"
		             + WFC.Translate.translate("statAccuracy") + " " + items[item].attacks[i].statAccuracy + "\n"
				     + WFC.Translate.translate("statCritChance") + " " + items[item].attacks[i].statCritChance + "\n"
					 + WFC.Translate.translate("statCritDamage") + " " + items[item].attacks[i].statCritDamage + "\n"
					 + WFC.Translate.translate("statFireRate") + " " + items[item].attacks[i].statFireRate + "\n"
					 + WFC.Translate.translate("statMagazine") + " " + items[item].attacks[i].statMagazine + "\n"
					 + WFC.Translate.translate("noiseGeneric") + " " + WFC.Translate.translate(items[item].attacks[i].noise) + "\n"
					 + WFC.Translate.translate("statReload") + " " + items[item].attacks[i].statReload + "\n"
					 + WFC.Translate.translate("statStatusChance") + " " + items[item].attacks[i].statStatusChance + "\n"
					 + WFC.Translate.translate("triggerGeneric") + " " + WFC.Translate.translate(items[item].attacks[i].statReload) + "\n";
		if (items[item].attacks[i].falloff) {
			v.innerText += "\n" + WFC.Translate.translate("%n falloffStart", items[item].attacks[i].falloff[0]) + "\n"
			             + WFC.Translate.translate("%n falloffEnd", items[item].attacks[i].falloff[1]) + "\n"
						 + WFC.Translate.translate("%n falloffAmount", items[item].attacks[i].falloff[2]) + "\n";
		}
		v.innerText += "\n";
		for (let j = 0; j < items[item].attacks[i].damage.length; j++) {
			v.innerText += WFC.Translate.translate(items[item].attacks[i].damage[j][0]) + " " + items[item].attacks[i].damage[j][1] + "\n";
		}

	}
}

function updateRivenMod() {
	var boon1ID = document.getElementById("rivenBoon1ID").value;
	var boon1Val = document.getElementById("rivenBoon1").value;
	var boon2ID = document.getElementById("rivenBoon2ID").value;
	var boon2Val = document.getElementById("rivenBoon2").value;
	var boon3ID = document.getElementById("rivenBoon3ID").value;
	var boon3Val = document.getElementById("rivenBoon3").value;
	var curseID = document.getElementById("rivenCurseID").value;
	var curseVal = document.getElementById("rivenCurse").value;

	var newRivenEffects = {};

	if (boon1ID) newRivenEffects[boon1ID] = boon1Val / 9 / 100;
	if (boon2ID) newRivenEffects[boon2ID] = boon2Val / 9 / 100;
	if (boon3ID) newRivenEffects[boon3ID] = boon3Val / 9 / 100;
	if (curseID) newRivenEffects[curseID] = curseVal / 9 / 100;

	rivenEffects = newRivenEffects;

	reloadSlots();
}

function updateRivenStatRanges() {
	var boon1ID = document.getElementById("rivenBoon1ID").value;
	var boon2ID = document.getElementById("rivenBoon2ID").value;
	var boon3ID = document.getElementById("rivenBoon3ID").value;
	var curseID = document.getElementById("rivenCurseID").value;

	var tristat = (boon1ID && boon2ID && boon3ID ? true : false);
	var hascurse = (curseID ? true : false);

	if (boon1ID && rivenData.categories[items[item].rivenType].buff[boon1ID]) {
		let base = rivenData.categories[items[item].rivenType].buff[boon1ID];
		base *= items[item].rivenDisposition;
		if (hascurse) base *= rivenData.logic.hascurse;
		if (tristat) base *= rivenData.logic["3rdbuff"];

		document.getElementById("rivenBoon1Min").innerText = truncatedstringFromFloat(base);
		document.getElementById("rivenBoon1Max").innerText = truncatedstringFromFloat(base * rivenData.logic.range);
	} else {
		document.getElementById("rivenBoon1Min").innerText = "";
		document.getElementById("rivenBoon1Max").innerText = "";
	}

	if (boon2ID && rivenData.categories[items[item].rivenType].buff[boon2ID]) {
		let base = rivenData.categories[items[item].rivenType].buff[boon2ID];
		base *= items[item].rivenDisposition;
		if (hascurse) base *= rivenData.logic.hascurse;
		if (tristat) base *= rivenData.logic["3rdbuff"];

		document.getElementById("rivenBoon2Min").innerText = truncatedstringFromFloat(base);
		document.getElementById("rivenBoon2Max").innerText = truncatedstringFromFloat(base * rivenData.logic.range);
	} else {
		document.getElementById("rivenBoon2Min").innerText = "";
		document.getElementById("rivenBoon2Max").innerText = "";
	}

	if (boon3ID && rivenData.categories[items[item].rivenType].buff[boon3ID]) {
		let base = rivenData.categories[items[item].rivenType].buff[boon3ID];
		base *= items[item].rivenDisposition;
		if (hascurse) base *= rivenData.logic.hascurse;
		if (tristat) base *= rivenData.logic["3rdbuff"];

		document.getElementById("rivenBoon3Min").innerText = truncatedstringFromFloat(base);
		document.getElementById("rivenBoon3Max").innerText = truncatedstringFromFloat(base * rivenData.logic.range);
	} else {
		document.getElementById("rivenBoon3Min").innerText = "";
		document.getElementById("rivenBoon3Max").innerText = "";
	}

	if (curseID && rivenData.categories[items[item].rivenType].curse[curseID]) {
		let base = rivenData.categories[items[item].rivenType].curse[curseID];
		base *= items[item].rivenDisposition;
		if (hascurse) base *= rivenData.logic.hascurse;
		if (tristat) base *= rivenData.logic["3rdcurse"];

		document.getElementById("rivenCurseMin").innerText = truncatedstringFromFloat(base);
		document.getElementById("rivenCurseMax").innerText = truncatedstringFromFloat(base * rivenData.logic.range);
	} else {
		document.getElementById("rivenCurseMin").innerText = "";
		document.getElementById("rivenCurseMax").innerText = "";
	}
}

function updateRivenComposite() {
	updateRivenStatRanges();
	updateRivenMod();
}

function updateRivenForm() {
	var v = document.getElementById("rivenBoon1ID");
	var keep = (Object.keys(rivenEffects).length > 0);
	var oldval = v.value;
	while (v.children.length > 0) {
		v.removeChild(v.lastElementChild);
	}

	var opt = document.createElement("option");
	opt.value = "";
	opt.innerText = WFC.Translate.translate("selectNone");
	v.appendChild(opt);
	var k = Object.keys(rivenData.categories[items[item].rivenType].buff);
	for (let i = 0; i < k.length; i++) {
		opt = document.createElement("option");
		opt.value = k[i];
		if (keep && k[i] == oldval) opt.selected = "selected";
		opt.innerText = WFC.Translate.translate(k[i]);
		v.appendChild(opt);
	}
	v.onchange = updateRivenComposite;

	v = document.getElementById("rivenBoon2ID");
	oldval = v.value;
	while (v.children.length > 0) {
		v.removeChild(v.lastElementChild);
	}
	opt = document.createElement("option");
	opt.value = "";
	opt.innerText = WFC.Translate.translate("selectNone");
	v.appendChild(opt);
	k = Object.keys(rivenData.categories[items[item].rivenType].buff);
	for (let i = 0; i < k.length; i++) {
		opt = document.createElement("option");
		opt.value = k[i];
		if (keep && k[i] == oldval) opt.selected = "selected";
		opt.innerText = WFC.Translate.translate(k[i]);
		v.appendChild(opt);
	}
	v.onchange = updateRivenComposite;

	v = document.getElementById("rivenBoon3ID");
	oldval = v.value;
	while (v.children.length > 0) {
		v.removeChild(v.lastElementChild);
	}
	opt = document.createElement("option");
	opt.value = "";
	opt.innerText = WFC.Translate.translate("selectNone");
	v.appendChild(opt);
	k = Object.keys(rivenData.categories[items[item].rivenType].buff);
	for (let i = 0; i < k.length; i++) {
		opt = document.createElement("option");
		opt.value = k[i];
		if (keep && k[i] == oldval) opt.selected = "selected";
		opt.innerText = WFC.Translate.translate(k[i]);
		v.appendChild(opt);
	}
	v.onchange = updateRivenComposite;

	v = document.getElementById("rivenCurseID");
	oldval = v.value;
	while (v.children.length > 0) {
		v.removeChild(v.lastElementChild);
	}
	opt = document.createElement("option");
	opt.value = "";
	opt.innerText = WFC.Translate.translate("selectNone");
	v.appendChild(opt);
	k = Object.keys(rivenData.categories[items[item].rivenType].curse);
	for (let i = 0; i < k.length; i++) {
		opt = document.createElement("option");
		opt.value = k[i];
		if (keep && k[i] == oldval) opt.selected = "selected";
		opt.innerText = WFC.Translate.translate(k[i]);
		v.appendChild(opt);
	}
	v.onchange = updateRivenComposite;

	document.getElementById("rivenBoon1").onchange = updateRivenMod;
	document.getElementById("rivenBoon1").onkeyup = updateRivenMod;
	document.getElementById("rivenBoon1ID").onkeyup = updateRivenMod;
	document.getElementById("rivenBoon2").onchange = updateRivenMod;
	document.getElementById("rivenBoon2").onkeyup = updateRivenMod;
	document.getElementById("rivenBoon2ID").onkeyup = updateRivenMod;
	document.getElementById("rivenBoon3").onchange = updateRivenMod;
	document.getElementById("rivenBoon3").onkeyup = updateRivenMod;
	document.getElementById("rivenBoon3ID").onkeyup = updateRivenMod;
	document.getElementById("rivenCurse").onchange = updateRivenMod;
	document.getElementById("rivenCurse").onkeyup = updateRivenMod;
	document.getElementById("rivenCurseID").onkeyup = updateRivenMod;

}

function updateMiscForm() {
	var v = document.getElementById("zoom");
	v.onchange = updateStatsum;
	var oldval = v.value;
	if (WFC.SharedData.Weapon.Zoom) {
		while (v.children.length > 0) {
			v.removeChild(v.lastElementChild);
		}

		var e = document.createElement("option");
		e.value = "";
		e.innerText = WFC.Translate.translate("selectBlank");
		e.selected = "selected";
		v.appendChild(e);

		for (let i = 0; i < WFC.SharedData.Weapon.Zoom.length; i++) {
			e = document.createElement("option");
			e.value = i;
			e.innerText = WFC.SharedData.Weapon.Zoom[i].statZoom;
			v.appendChild(e);
		}
		v.parentElement.classList.remove("hide2");
		v.onchange();
	} else {
		v.parentElement.classList.add("hide2");
	}
}

function applyItem(e) {
	let v = e.target.value;
	if (v !== -1 && v != item) {
		if (items[item] && items[item].rivenType != items[v].rivenType) rivenEffects = {};
		item = v;

		updateRivenForm();
		updateRivenStatRanges();
		updateMiscForm();
		displayItem();
	}
}

function displayMisc() {
	//TODO localize that form
};

WFC.SharedData = {
	"Weapon": null,
	"Mods": null
};

WFC.Modding = (function (WFC, srcData, window, undefined) {
	var Mods;

	function initData() {
		WFC.Util.debug("Modding.initData");
		WFC.SharedData.Mods = this.response.Mods;
		initializeModsList();
		initializeModSlots();
		WFC.Translate.addHook(reloadSlots);
		WFC.Translate.addHook(updateDamageCalcs);
	}

	var obj = {};

	obj.init = function() {
		WFC.Util.debug("Modding.init");
		var request = new XMLHttpRequest();
		request.open("GET", srcData);
		request.responseType = "json";
		request.onload = initData;
		request.send();
	};

	return obj;
})(WFC, "project/data/ModData.json", window);

WFC.Translate = (function (pathSrc, idLabel, idSelect, window, undefined) {
	var locales = {
		"en": "English",
		"fr": "Français",
		//'it': 'Italiano',
		//'de': 'Deutsch',
		//'sp': 'Español',
		//'pt': 'Português',
		//'ru': 'Pусский',
		//'pl': 'Polski',
		//'uk': 'Українська',
		//'tr': 'Türkçe',
		//'jp': '日本語',
		//'zh-CN': '中文',
		//'ko': '한국어'
	};
	var locale = "";
	var Dict = {};
	var labels = {};
	var hooks = [];


	if (!!window.localStorage) {
		let v = window.localStorage.getItem('lang');
		if (v === null) {
			window.localStorage.setItem('lang', locale);
		}
	}

	function translate(key) {
		if (Dict[key]) {
			return Dict[key];
		} else {
			return key;
		}
	}

	function applyLang() {
		locale = this.response.code;
		Dict = this.response.values;

		window.document.children[0].lang = locale;

		var k = Object.keys(labels);
		for (let i = 0; i < k.length; i++) {
			document.getElementById(k[i])[labels[k[i]].prop] = translate(labels[k[i]].key);
		}
		for (let i = 0; i < hooks.length; i++) {
			hooks[i]();
		}
	}

	function requestLang(e) {
		var newlanguage = e.target.value;

		if (locale !== newlanguage) {
			var request = new XMLHttpRequest();
			request.open("GET", pathSrc + "lang." + newlanguage + ".json");
			request.responseType = "json";
			request.onload = applyLang;
			request.send();

			if (!!window.localStorage) {
				window.localStorage.setItem('lang', newlanguage);
			}
		}
	}

	var obj = {};

	obj.translate = translate;

	obj.add = function (id, key, prop) {
		labels[id] = {
			"key": key,
			"prop": prop
		};
	};
	
	obj.addHook = function(func) {
		if (!hooks.includes(func)) {
			hooks.push(func);
		}
	}

	obj.init = function () {
		var ls = window.document.getElementById(idSelect);
		var newlanguage = "en";

		if (!!window.localStorage) {
			let v = window.localStorage.getItem('lang');
			if (v !== null) {
				newlanguage = v;
			}
		}

		var k = Object.keys(locales);
		for (let i = 0; i < k.length; i++) {
			let e = window.document.createElement('option');
			e.text = locales[k[i]];
			e.value = k[i];
			if (k[i] == newlanguage) {
				e.selected = 'selected';
			}
			ls.add(e);
		}
		ls.onchange = requestLang;

		requestLang({target:{value:newlanguage}});
	}

	return obj;
})("project/data/", "labelLanguageSelect", "inputLanguageSelect", window);

WFC.Util = {
	"doDebug": true,
	"addElement": function (parentElement, typeElement, props = {}) {
		var e = document.createElement(typeElement);

		var k = Object.keys(props);
		for (let i = 0; i < k.length; i++) {
			e[k[i]] = props[k[i]];
		}
		parentElement.appendChild(e);

		//WFC.Util.debug("Warning: fancy element creationfunc called: " + JSON.stringify(arguments));
		return e;
	},
	"debug": function (v)  {
		if (this.doDebug) {
			var debugBox = document.getElementById("debug");
			if (!debugBox) {
				debugBox = this.addElement(document.body, "pre", {"id": "debug"});
			}
			debugBox.innerText += v + "\n";
		}
	},
};

WFC.Weapons = (function(WFC, srcData, idForm, idSelectGroup, idSelectWeapon, window, undefined) {
	var Weapons;
	var Group;

	function changeWeaponSelect(e) {
		WFC.Util.debug("Weapons.changeWeaponSelect - " + e.target.value);
		if (Group === e.target.value) {
			return;
		}
		Group = e.target.value;

		var children = document.getElementById(idSelectWeapon).children;
		for (let i = 0; i < children.length; i++) {
			if (children[i].tagName === "OPTGROUP") {
				if (children[i].getAttribute("data-parent") === Group) {
					children[i].disabled = false;
					children[i].hidden = false;
				} else {
					children[i].disabled = true;
					children[i].hidden = true;
				}
			}
		}
		document.getElementById(idSelectWeapon).selectedIndex = 0;
	}

	function changeWeapon(e) {
		WFC.Util.debug("Weapons.changeWeapon - " + e.target.value);

		WFC.SharedData.Weapon = JSON.parse(JSON.stringify(Weapons.Weapons[e.target.value]));
		updateStatsum();
		updateMiscForm();
	}

	function initForm() {
		WFC.Util.debug("Weapons.initForm");

		document.getElementById(idForm).onsubmit = function () { return false; };

		var selectCategory = document.getElementById(idSelectGroup);
		var selectWeapon = document.getElementById(idSelectWeapon);

		var groups = Object.keys(Weapons.Tree);
		for (let iGroup = 0; iGroup < groups.length; iGroup++) {
			let eG = WFC.Util.addElement(selectCategory, "option", {
				"id": "optionWeaponGroup" + groups[iGroup],
				"value": groups[iGroup],
				"label": WFC.Translate.translate("weaponGroup" + groups[iGroup])
			});
			WFC.Translate.add(eG.id, "weaponGroup" + groups[iGroup], "label");

			let subGroups = Object.keys(Weapons.Tree[groups[iGroup]]);
			for (let iSub = 0; iSub < subGroups.length; iSub++) {
				let eSG = WFC.Util.addElement(selectWeapon, "optgroup", {
					"id": "optionWeaponSubGroup" + subGroups[iSub],
					"label": WFC.Translate.translate("weaponSubGroup" + subGroups[iSub])
				});
				eSG.setAttribute("data-parent", groups[iGroup]);
				WFC.Translate.add(eSG.id, "weaponSubGroup" + subGroups[iSub], "label");

				let weapons = Weapons.Tree[groups[iGroup]][subGroups[iSub]];
				for (let iWeapon = 0; iWeapon < weapons.length; iWeapon++) {
					WFC.Util.addElement(eSG, "option", {
						"value": weapons[iWeapon],
						"label": weapons[iWeapon]
					});
				}
			}
		}

		selectCategory.onchange = changeWeaponSelect;
		selectWeapon.onchange = changeWeapon;

		changeWeaponSelect({"target":{"value":groups[0]}});
	}

	function initData() {
		WFC.Util.debug("Weapons.initData");
		try {
			Weapons = this.response;

			initForm();
		} catch (e) {
			console.log("Failed to initialize the basic weapon selection form. Panic!");
			console.log(e);
		}
	}

	var obj = {};
	obj.init = function () {
		WFC.Util.debug("Weapons.init");
		WFC.Translate.add("optionWeaponSelectBlank", "selectBlankWeapon", "label");
		var request = new XMLHttpRequest();
		request.open("GET", srcData);
		request.responseType = "json";
		request.onload = initData;
		request.send();
	};
	return obj;
})(WFC, "project/data/WeaponData.json", "formWeaponChoice", "inputWeaponSelectGroup", "inputWeaponSelect", window);

window.addEventListener("load", function () {
	WFC.Modding.init();
	WFC.Weapons.init();
	WFC.Translate.init();
});