var WFC = {};
/*
			<tr><td>Accuracy</td><td>13.3</td></tr>
			<tr><td>Critical Chance</td><td>95.0%</td></tr>
			<tr><td>Critical Multiplier</td><td>5.3x</td></tr>
			<tr><td>Falloff</td><td>400.0 - 600.0</td></tr>
			<tr><td>Fire Rate</td><td>3.67</td></tr>
			<tr><td>Magazine</td><td>5</td></tr>
			<tr><td>Noise</td><td>Alarming</td></tr>
			<tr><td>Punch Through</td><td>1.0</td></tr>
			<tr><td>Reload</td><td>2.0</td></tr>
			<tr><td>Riven Disposition</td><td>3/5</td></tr>
			<tr><td>Status</td><td>28.2%</td></tr>
			<tr><td>Trigger</td><td>Semi</td></tr>
			<tr><td colspan="2">&nbsp;</td></tr>
			<tr><td>Impact</td><td>1424</td></tr>
			<tr><td>Electricity</td><td>1188</td></tr>
			<tr><td>Slash</td><td>89.0</td></tr>
			<tr><td>Puncture</td><td>267.0</td></tr>
			<tr><td>Viral</td><td>2670</td></tr>
*/
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
	var fireRate = (stats.Trigger == "triggerCharge" ? 1 / stats.ChargeTime : stats.FireRate) *(1 + (statsum.bonusFireRate?statsum.bonusFireRate:0) + (stats.Trigger == "triggerCharge" && statsum.bonusChargeRate? statsum.bonusChargeRate:0));
	var magazine = Math.floor(WFC.SharedData.Weapon.Magazine * (1 + (statsum.bonusMagazine?statsum.bonusMagazine:0)));
	var reload = WFC.SharedData.Weapon.Reload / (1 + (statsum.bonusReload?statsum.bonusReload:0));
	var ammo = Math.floor(WFC.SharedData.Weapon.Ammo * (1 + (statsum.bonusAmmo?statsum.bonusAmmo:0)));
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

	for (var m = 0; m < WFC.SharedData.Modding.Weapon.Slots.length; m++) {
		let modID = WFC.SharedData.Modding.Weapon.Slots[m].ModID;
		if (modID) {
			let mod = WFC.SharedData.Mods[modID];
			let rank = WFC.SharedData.Modding.Weapon.Slots[m].Rank;
			let set = WFC.SharedData.Mods[modID].set;
			let effects = (mod.sharedID && mod.sharedID == "modRiven" ? WFC.SharedData.Modding.Riven.effects : mod.effects);

			let k = Object.keys(effects);
			if (mod.sharedID && mod.sharedID == "modRiven") k.reverse();
			for (let i = 0; i < k.length; i++) {
				let adj = effects[k[i]] * (rank + 1);
				if (newStatsum[k[i]]) {
					newStatsum[k[i]] += adj;
				} else {
					newStatsum[k[i]] = adj;
				}
			}
			if (set) {
				if (newStatsum[set]) {
					newStatsum[set] ++;
				} else {
					newStatsum[set] = 1;
				}
			}
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

	if (WFC.SharedData.Weapon) {
		updateDamageCalcs();
	}
}

var DragHandler = (function(window, undefined){
	var dragSrc = null;

	return {
		"enter": function handleDragEnter(e) {
			this.classList.add("over");
		},
		"leave": function handleDragLeave(e) {
			this.classList.remove("over");
		},
		"start": function handleDragStart(e) {
			dragSrc = this;

			e.dataTransfer.effectAllowed = "move";
		},
		"over": function handleDragOver(e) {
			if (e.preventDefault) {
				e.preventDefault();
			}

			e.dataTransfer.dropEffect = "move";

			return false;
		},
		"drop": function handleDrop(e) {
			if (e.stopPropogation) {
				e.stopPropogation();
			}

			if (dragSrc !== this && (dragSrc.classList.contains("modSlot") || this.classList.contains("modSlot"))) {
				WFC.Modding.moveMod(dragSrc, this);
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

WFC.SharedData = {
	"Weapon": null,
	"Modding": {
		"Weapon": {
			"Stance": null,
			"Arcane": null,
			"Slots": []
		},
		"Riven": {
			"effects": {}
		}
	},
	"Mods": null
};

WFC.RivenHandling = (function (WFC, idForm, window, undefined) {
	var elementForm;
	var rivenSlots = ["Boon1", "Boon2", "Boon3", "Curse"];
	
	var rivenLogic = {
		"range": 1.222,
		"hascurse": 1.25,
		"3rdbuff": 1/1.32,
		"3rdcurse": 1.516
	};
	var rivenEffects = {
		"Boons": {
			"bonusMultishot": {
				"Rifle": 80.16,
				"Secondary": 106.64,
				"Shotgun": 106.64,
				"Melee": NaN,
				"Kitgun": 106.64
			},
			"bonusDamage": {
				"Rifle": 147.04,
				"Secondary": 195.68,
				"Shotgun": 146.72,
				"Melee": NaN,
				"Kitgun": 195.68
			},
			"bonusMeleeDamage": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": 146.72,
				"Kitgun": NaN
			},
			"bonusImpact": {
				"Rifle": 106.88,
				"Secondary": 106.88,
				"Shotgun": 106.88,
				"Melee": 106.64,
				"Kitgun": 106.88
			},
			"bonusPuncture": {
				"Rifle": 106.88,
				"Secondary": 106.88,
				"Shotgun": 106.88,
				"Melee": 106.64,
				"Kitgun": 106.88
			},
			"bonusSlash": {
				"Rifle": 106.88,
				"Secondary": 106.88,
				"Shotgun": 106.88,
				"Melee": 106.64,
				"Kitgun": 106.88
			},
			"bonusCritChance": {
				"Rifle": 133.68,
				"Secondary": 133.68,
				"Shotgun": 80.16,
				"Melee": 80.16,
				"Kitgun": 133.68
			},
			"bonusCritDamage": {
				"Rifle": 106.96,
				"Secondary": 80.16,
				"Shotgun": 80.16,
				"Melee": 80.16,
				"Kitgun": 80.16
			},
			"bonusHeat": {
				"Rifle": 80.16,
				"Secondary": 80.16,
				"Shotgun": 80.16,
				"Melee": 80.16,
				"Kitgun": 80.16
			},
			"bonusToxin": {
				"Rifle": 80.16,
				"Secondary": 80.16,
				"Shotgun": 80.16,
				"Melee": 80.16,
				"Kitgun": 80.16
			},
			"bonusElectricity": {
				"Rifle": 80.16,
				"Secondary": 80.16,
				"Shotgun": 80.16,
				"Melee": 80.16,
				"Kitgun": 80.16
			},
			"bonusCold": {
				"Rifle": 80.16,
				"Secondary": 80.16,
				"Shotgun": 80.16,
				"Melee": 80.16,
				"Kitgun": 80.16
			},
			"bonusStatusChance": {
				"Rifle": 80.16,
				"Secondary": 80.16,
				"Shotgun": 80.16,
				"Melee": 80.16,
				"Kitgun": 80.16
			},
			"bonusStatusDuration": {
				"Rifle": 89.12,
				"Secondary": 89.12,
				"Shotgun": 89.12,
				"Melee": 89.12,
				"Kitgun": 89.12
			},
			"baneCorpus": {
				"Rifle": 40.08,
				"Secondary": 40.08,
				"Shotgun": 40.08,
				"Melee": 40.08,
				"Kitgun": 40.08
			},
			"baneInfested": {
				"Rifle": 40.08,
				"Secondary": 40.08,
				"Shotgun": 40.08,
				"Melee": 40.08,
				"Kitgun": 40.08
			},
			"baneGrineer": {
				"Rifle": 40.08,
				"Secondary": 40.08,
				"Shotgun": 40.08,
				"Melee": 40.08,
				"Kitgun": 40.08
			},
			"bonusFireRate": {
				"Rifle": 53.52,
				"Secondary": 66.56,
				"Shotgun": 80.16,
				"Melee": NaN,
				"Kitgun": 66.56
			},
			"Attack Speed": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": 48.88,
				"Kitgun": NaN
			},
			"Channeling Efficiency": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": 80.16,
				"Kitgun": NaN
			},
			"Channeling Damage": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": 133.92,
				"Kitgun": NaN
			},
			"Finisher Damage": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": 106.64,
				"Kitgun": NaN
			},
			"Range": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": 106.64,
				"Kitgun": NaN
			},
			"chance for Slide Attack to be a Critical": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": 80.16,
				"Kitgun": NaN
			},
			"Combo Duration": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": 7.2,
				"Kitgun": NaN
			},
			"bonusMagazine": {
				"Rifle": 44.56,
				"Secondary": 44.56,
				"Shotgun": 44.56,
				"Melee": NaN,
				"Kitgun": 44.56
			},
			"bonusAmmo": {
				"Rifle": 44.48,
				"Secondary": 80.16,
				"Shotgun": 80.16,
				"Melee": NaN,
				"Kitgun": 80.16
			},
			"Flight Speed": {
				"Rifle": 80.16,
				"Secondary": 80.16,
				"Shotgun": 80.16,
				"Melee": NaN,
				"Kitgun": 80.16
			},
			"bonusReload": {
				"Rifle": 44.56,
				"Secondary": 44.56,
				"Shotgun": 44.56,
				"Melee": NaN,
				"Kitgun": 44.56
			},
			"Weapon Recoil": {
				"Rifle": -80.16,
				"Secondary": -80.16,
				"Shotgun": -80.16,
				"Melee": NaN,
				"Kitgun": -80.16
			},
			"bonusZoom": {
				"Rifle": 53.44,
				"Secondary": 71.36,
				"Shotgun": NaN,
				"Melee": NaN,
				"Kitgun": 71.36
			},
			"flatPunchThrough": {
				"Rifle": 2.4,
				"Secondary": 2.4,
				"Shotgun": 2.4,
				"Melee": NaN,
				"Kitgun": 2.4
			}
		},
		"Curses": {
			"bonusMultishot": {
				"Rifle": -32.08,
				"Secondary": -42.64,
				"Shotgun": -42.64,
				"Melee": NaN,
				"Kitgun": -42.64
			},
			"bonusDamage": {
				"Rifle": -58.8,
				"Secondary": -78.24,
				"Shotgun": -58.72,
				"Melee": NaN,
				"Kitgun": -78.24
			},
			"bonusImpact": {
				"Rifle": -42.72,
				"Secondary": -42.72,
				"Shotgun": NaN,
				"Melee": -42.64,
				"Kitgun": -42.72
			},
			"bonusPuncture": {
				"Rifle": -42.72,
				"Secondary": -42.72,
				"Shotgun": NaN,
				"Melee": -42.64,
				"Kitgun": -42.72
			},
			"bonusSlash": {
				"Rifle": -42.72,
				"Secondary": -42.72,
				"Shotgun": NaN,
				"Melee": -42.64,
				"Kitgun": -42.72
			},
			"bonusCritChance": {
				"Rifle": -53.44,
				"Secondary": -53.44,
				"Shotgun": -32.08,
				"Melee": -32.08,
				"Kitgun": -53.44
			},
			"bonusCritDamage": {
				"Rifle": -42.8,
				"Secondary": -32.08,
				"Shotgun": -32.08,
				"Melee": -32.08,
				"Kitgun": -32.08
			},
			"bonusStatusChance": {
				"Rifle": -32.08,
				"Secondary": -32.08,
				"Shotgun": -32.08,
				"Melee": -32.08,
				"Kitgun": -32.08
			},
			"bonusStatusDuration": {
				"Rifle": -35.6,
				"Secondary": -35.6,
				"Shotgun": -35.6,
				"Melee": -35.6,
				"Kitgun": -35.6
			},
			"baneCorpus": {
				"Rifle": -16,
				"Secondary": -16,
				"Shotgun": -16,
				"Melee": -16,
				"Kitgun": -16
			},
			"baneInfested": {
				"Rifle": -16,
				"Secondary": -16,
				"Shotgun": -16,
				"Melee": -16,
				"Kitgun": -16
			},
			"baneGrineer": {
				"Rifle": -16,
				"Secondary": -16,
				"Shotgun": -16,
				"Melee": -16,
				"Kitgun": -16
			},
			"bonusFireRate": {
				"Rifle": -21.36,
				"Secondary": -26.64,
				"Shotgun": -32.08,
				"Melee": NaN,
				"Kitgun": -26.64
			},
			"Attack Speed": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": -19.6,
				"Kitgun": NaN				
			},
			"Finisher Damage": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": -42.64,
				"Kitgun": NaN				
			},
			"chance for Slide Attack to be a Critical": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": -32.08,
				"Kitgun": NaN				
			},
			"Combo Duration": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": -2.88,
				"Kitgun": NaN				
			},
			"Range": {
				"Rifle": NaN,
				"Secondary": NaN,
				"Shotgun": NaN,
				"Melee": -42.64,
				"Kitgun": NaN				
			},
			"bonusMagazine": {
				"Rifle": -17.84,
				"Secondary": -17.84,
				"Shotgun": -17.84,
				"Melee": NaN,
				"Kitgun": -17.84
			},
			"bonusAmmo": {
				"Rifle": -17.84,
				"Secondary": -32.08,
				"Shotgun": -32.08,
				"Melee": NaN,
				"Kitgun": -32.08
			},
			"Flight Speed": {
				"Rifle": -32.08,
				"Secondary": -32.08,
				"Shotgun": -32.08,
				"Melee": NaN,
				"Kitgun": -32.08
			},
			"bonusReload": {
				"Rifle": -17.84,
				"Secondary": -17.84,
				"Shotgun": -17.84,
				"Melee": NaN,
				"Kitgun": -17.84
			},
			"Weapon Recoil": {
				"Rifle": 32.08,
				"Secondary": 32.08,
				"Shotgun": 32.08,
				"Melee": NaN,
				"Kitgun": 32.08
			},
			"bonusZoom": {
				"Rifle": -21.36,
				"Secondary": -28.56,
				"Shotgun": NaN,
				"Melee": NaN,
				"Kitgun": -28.56
			}
		}
	};
	
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

		if (boon1ID) {
			if (boon1ID.indexOf("bonus") === 0 || boon1ID.indexOf("resist") === 0) {
				boon1Val /= 100;
			}
			if (newRivenEffects[boon1ID]) {
				newRivenEffects[boon1ID] += boon1Val / 9;
			} else {
				newRivenEffects[boon1ID] = boon1Val / 9;
			}
		}
		if (boon2ID) {
			if (boon2ID.indexOf("bonus") === 0 || boon2ID.indexOf("resist") === 0) {
				boon2Val /= 100;
			}
			if (newRivenEffects[boon2ID]) {
				newRivenEffects[boon2ID] += boon2Val / 9;
			} else {
				newRivenEffects[boon2ID] = boon2Val / 9;
			}
		}
		if (boon3ID) {
			if (boon3ID.indexOf("bonus") === 0 || boon3ID.indexOf("resist") === 0) {
				boon3Val /= 100;
			}
			if (newRivenEffects[boon3ID]) {
				newRivenEffects[boon3ID] += boon3Val / 9;
			} else {
				newRivenEffects[boon3ID] = boon3Val / 9;
			}
		}
		if (curseID) {
			if (curseID.indexOf("bonus") === 0 || curseID.indexOf("resist") === 0) {
				curseVal /= 100;
			}
			if (newRivenEffects[curseID]) {
				newRivenEffects[curseID] += curseVal / 9;
			} else {
				newRivenEffects[curseID] = curseVal / 9;
			}
		}

		WFC.SharedData.Modding.Riven.effects = newRivenEffects;
		
		Object.entries(WFC.SharedData.Modding.Weapon.Slots).forEach(slot => {
			if (slot[1].ModID === "modRiven") {
				WFC.Modding.redrawSlot("Weapon", slot[0]);
			}
		});
		updateStatsum();
	}

	function updateRivenStatRanges() {
		var group = WFC.SharedData.Weapon && WFC.SharedData.Weapon.RivenGroup;
		var disposition = WFC.SharedData.Weapon && WFC.SharedData.Weapon.Disposition;
		
		var boon1ID = document.getElementById("rivenBoon1ID").value;
		var boon1Weight = boon1ID && rivenEffects.Boons[boon1ID][group];
		var boon2ID = document.getElementById("rivenBoon2ID").value;
		var boon2Weight = boon2ID && rivenEffects.Boons[boon2ID][group];
		var boon3ID = document.getElementById("rivenBoon3ID").value;
		var boon3Weight = boon3ID && rivenEffects.Boons[boon3ID][group];
		var curseID = document.getElementById("rivenCurseID").value;
		var curseWeight = curseID && rivenEffects.Boons[curseID][group];

		var tristat = (boon1ID && boon2ID && boon3ID ? true : false);
		var hascurse = (curseID ? true : false);

		if (boon1Weight) {
			let base = boon1Weight;
			base *= disposition;
			if (hascurse) base *= rivenLogic.hascurse;
			if (tristat) base *= rivenLogic["3rdbuff"];

			document.getElementById("rivenBoon1Min").innerText = truncatedstringFromFloat(base);
			document.getElementById("rivenBoon1Max").innerText = truncatedstringFromFloat(base * rivenLogic.range);
		} else {
			document.getElementById("rivenBoon1Min").innerText = "";
			document.getElementById("rivenBoon1Max").innerText = "";
		}

		if (boon2ID && boon2Weight) {
			let base = boon2Weight;
			base *= disposition;
			if (hascurse) base *= rivenLogic.hascurse;
			if (tristat) base *= rivenLogic["3rdbuff"];

			document.getElementById("rivenBoon2Min").innerText = truncatedstringFromFloat(base);
			document.getElementById("rivenBoon2Max").innerText = truncatedstringFromFloat(base * rivenLogic.range);
		} else {
			document.getElementById("rivenBoon2Min").innerText = "";
			document.getElementById("rivenBoon2Max").innerText = "";
		}

		if (boon3ID && boon3Weight) {
			let base = boon3Weight;
			base *= disposition;
			if (hascurse) base *= rivenLogic.hascurse;
			if (tristat) base *= rivenLogic["3rdbuff"];

			document.getElementById("rivenBoon3Min").innerText = truncatedstringFromFloat(base);
			document.getElementById("rivenBoon3Max").innerText = truncatedstringFromFloat(base * rivenLogic.range);
		} else {
			document.getElementById("rivenBoon3Min").innerText = "";
			document.getElementById("rivenBoon3Max").innerText = "";
		}

		if (curseID && curseWeight) {
			let base = curseWeight;
			base *= disposition;
			if (hascurse) base *= rivenLogic.hascurse;
			if (tristat) base *= rivenLogic["3rdcurse"];

			document.getElementById("rivenCurseMin").innerText = truncatedstringFromFloat(base);
			document.getElementById("rivenCurseMax").innerText = truncatedstringFromFloat(base * rivenLogic.range);
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
		var group = WFC.SharedData.Weapon && WFC.SharedData.Weapon.RivenGroup;
		var disposition = WFC.SharedData.Weapon && WFC.SharedData.Weapon.Disposition;
		if (!group || !disposition) {
			return;
		}
		console.log(group, disposition);
		
		var children = document.getElementById("rivenBoon1ID").children;
		for (let i = 0; i < children.length; i++) {
			if (rivenEffects.Boons[children[i].value] && rivenEffects.Boons[children[i].value][group]) {
				children[i].disabled = false;
				children[i].hidden = false;
			} else {
				children[i].disabled = true;
				children[i].hidden = true;
			}
		}
		
		children = document.getElementById("rivenBoon2ID").children;
		for (let i = 0; i < children.length; i++) {
			if (rivenEffects.Boons[children[i].value] && rivenEffects.Boons[children[i].value][group]) {
				children[i].disabled = false;
				children[i].hidden = false;
			} else {
				children[i].disabled = true;
				children[i].hidden = true;
			}
		}
		
		children = document.getElementById("rivenBoon3ID").children;
		for (let i = 0; i < children.length; i++) {
			if (rivenEffects.Boons[children[i].value] && rivenEffects.Boons[children[i].value][group]) {
				children[i].disabled = false;
				children[i].hidden = false;
			} else {
				children[i].disabled = true;
				children[i].hidden = true;
			}
		}
		
		children = document.getElementById("rivenCurseID").children;
		for (let i = 0; i < children.length; i++) {
			if (rivenEffects.Curses[children[i].value] && rivenEffects.Curses[children[i].value][group]) {
				children[i].disabled = false;
				children[i].hidden = false;
			} else {
				children[i].disabled = true;
				children[i].hidden = true;
			}
		}
	}
	
	function updateRivenFormComposite() {
		updateRivenForm();
		updateRivenStatRanges();
	}
	

	function displayRivenEditor() {
		for (let i = 0; i < WFC.SharedData.Modding.Weapon.Slots.length; i++) {
			if (WFC.SharedData.Modding.Weapon.Slots[i].ModID === "modRiven") {
				elementForm.classList.remove("hide2");
				return;
			}
		}
		elementForm.classList.add("hide2");
		return;
	}
	
/*
	LOCALIZEME
	<table>
	<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>Min</td><td>Max</td></tr>
	<tr><td>Boon1</td><td><select id="rivenBoon1ID"></select></td><td><input id="rivenBoon1" size="4"></td><td id="rivenBoon1Min"></td><td id="rivenBoon1Max"></td></tr>
	<tr><td>Boon2</td><td><select id="rivenBoon2ID"></select></td><td><input id="rivenBoon2" size="4"></td><td id="rivenBoon2Min"></td><td id="rivenBoon2Max"></td></tr>
	<tr><td>Boon3</td><td><select id="rivenBoon3ID"></select></td><td><input id="rivenBoon3" size="4"></td><td id="rivenBoon3Min"></td><td id="rivenBoon3Max"></td></tr>
	<tr><td>Curse</td><td><select id="rivenCurseID"></select></td><td><input id="rivenCurse" size="4"></td><td id="rivenCurseMin"></td><td id="rivenCurseMax"></td></tr>
	</table>
*/
	function initRivenForm() {
		elementForm = document.getElementById(idForm);
		
		var desc = document.createElement("span");
		desc.id = "labelRivenEditor";
		desc.innerText = "labelRivenEditor";
		WFC.Translate.add(desc.id, desc.innerText, "innerText");
		elementForm.appendChild(desc);
		
		var table = document.createElement("table");
		
		var row = document.createElement("thead");
		
		var cell = document.createElement("th");
		cell.id = "labelRivenCol1";
		cell.innerText = "labelSlot";
		WFC.Translate.add(cell.id, cell.innerText, "innerText");
		row.appendChild(cell);
		
		cell = document.createElement("th");
		cell.id = "labelRivenCol2";
		cell.innerText = "labelEffect";
		WFC.Translate.add(cell.id, cell.innerText, "innerText");
		row.appendChild(cell);
		
		cell = document.createElement("th");
		cell.id = "labelRivenCol2";
		cell.innerText = "labelStrength";
		WFC.Translate.add(cell.id, cell.innerText, "innerText");
		row.appendChild(cell);
		
		cell = document.createElement("th");
		cell.id = "labelRivenCol4";
		cell.innerText = "labelMinimum";
		WFC.Translate.add(cell.id, cell.innerText, "innerText");
		row.appendChild(cell);
		
		cell = document.createElement("th");
		cell.id = "labelRivenCol5";
		cell.innerText = "labelMaximum";
		WFC.Translate.add(cell.id, cell.innerText, "innerText");
		row.appendChild(cell);
		
		table.appendChild(row);
		
		rivenSlots.forEach(v => {
			row = document.createElement("tr");
			
			cell = document.createElement("th");
			cell.id = "labelRiven" + v;
			cell.innerText = cell.id;
			WFC.Translate.add(cell.id, cell.innerText, "innerText");
			row.appendChild(cell);
			
			cell = document.createElement("td");
			let sel = document.createElement("select");
			sel.id = "riven" + v + "ID";
			sel.onkeyup = updateRivenMod;
			sel.onchange = updateRivenComposite;
			
			var opt = document.createElement("option");
			opt.value = "";
			opt.id = sel.id + "selectNone";
			opt.innerText = "selectNone";
			WFC.Translate.add(opt.id, opt.innerText, "innerText");
			sel.appendChild(opt);
			Object.entries(rivenEffects[(v === "Curse" ? "Curses" : "Boons")]).forEach(effect => {
				opt = document.createElement("option");
				opt.value = effect[0];
				opt.id = sel.id + opt.value;
				opt.innerText = opt.value;
				WFC.Translate.add(opt.id, opt.innerText, "innerText");
				sel.appendChild(opt);
			});
			
			cell.appendChild(sel);			
			row.appendChild(cell);
			
			cell = document.createElement("td");
			let input = document.createElement("input");
			input.id = "riven" + v;
			input.size = 4;
			input.onchange = updateRivenMod;
			input.onkeyup = updateRivenMod;
			cell.appendChild(input);
			row.appendChild(cell);
			
			cell = document.createElement("td");
			cell.id = "riven" + v + "Min";
			cell.innerText = "";
			row.appendChild(cell);
			
			cell = document.createElement("td");
			cell.id = "riven" + v + "Max";
			cell.innerText = "";
			row.appendChild(cell);
			
			table.appendChild(row);
		});
		
		elementForm.appendChild(table);
	}
	
	var obj = {};
	
	obj.updateRivenFormVisibility = displayRivenEditor;
	
	obj.init = function() {
		initRivenForm();
		document.getElementById("inputWeaponSelect").addEventListener("change", updateRivenFormComposite);
	}
	
	return obj;
})(WFC, "formRiven", window, undefined);

WFC.Modding = (function (WFC, srcData, window, undefined) {
	var Mods;
	var Polarities = [" ", "V", "D", "—", "=", "R", "Y", "U"];

	function updateModInventory() {
		let k = Object.keys(WFC.SharedData.Mods);
		let group = WFC.SharedData.Weapon.Group;
		for (let i = 0; i < k.length; i++) {
			if (WFC.SharedData.Mods[k[i]].group === group) {
				document.getElementById(k[i]).parentElement.classList.remove("modTileVisibilityOverride");
			} else {
				document.getElementById(k[i]).parentElement.classList.add("modTileVisibilityOverride");
			}
		}
	}
	
	function getAdjustedCost(group, index) {
		if (! WFC.SharedData.Modding[group].Slots[index].ModID || ! WFC.SharedData.Mods[WFC.SharedData.Modding[group].Slots[index].ModID]) {
			return 0;
		}

		var cost = WFC.SharedData.Mods[WFC.SharedData.Modding[group].Slots[index].ModID].cost + WFC.SharedData.Modding[group].Slots[index].Rank;

		if (WFC.SharedData.Modding[group].Slots[index].Polarity !== Polarities[0]) {
			if (WFC.SharedData.Modding[group].Slots[index].Polarity === WFC.SharedData.Mods[WFC.SharedData.Modding[group].Slots[index].ModID].polarity) {
				cost -= Math.floor(cost / 2.0);
			} else {
				cost += Math.ceil(cost * 0.25);
			}
		}

		return cost;
	}

	function drawCapacity(group) {
		var base = 60;
		var used = 0;

		for (let i = 0; i < WFC.SharedData.Modding[group].Slots.length; i++) {
			used += getAdjustedCost(group, i);
		}

		document.getElementById("editor" + group + "ValueCapacity").innerText = (base - used) + "/60";
	}

	function drawModSlot(group, index) {
		let elementTarget = WFC.SharedData.Modding[group].Slots[index].Element;
		let modID = WFC.SharedData.Modding[group].Slots[index].ModID;

		/*
			<div class="modSlot" data-category="Weapon" data-index="0">
			0	<span class="modSlotPolarity"></span>
			1	<span class="modUsage"></span>
			2	<div class="modRank hide"><button>-</button><span>0/0</span><button>+</button></div>
			3	<div class="modName"></div>
			4	<div class="modContent"></div>
			5	<div class="modGroup"></div>
			</div>
		*/

		elementTarget.children[0].innerText = WFC.SharedData.Modding[group].Slots[index].Polarity;
		elementTarget.children[1].classList.remove("polaritymatch");
		elementTarget.children[1].classList.remove("polarityconflict");
		if (modID) {
			let adjustedcost = getAdjustedCost(group, index);

			elementTarget.children[1].innerText = adjustedcost + " " + WFC.SharedData.Mods[modID].polarity;

			if (WFC.SharedData.Modding[group].Slots[index].Polarity !== Polarities[0]) {
				if (WFC.SharedData.Modding[group].Slots[index].Polarity === WFC.SharedData.Mods[modID].polarity) {
					elementTarget.children[1].classList.add("polaritymatch");
				} else {
					elementTarget.children[1].classList.add("polarityconflict");
				}
			}

			elementTarget.children[2].classList.remove("hide");
			elementTarget.children[2].children[1].innerText = WFC.SharedData.Modding[group].Slots[index].Rank + "/" + WFC.SharedData.Mods[modID].ranks;

			elementTarget.children[3].innerText = WFC.Translate.translate(modID);

			elementTarget.children[4].innerText = "";
			if (WFC.SharedData.Mods[modID].condition) {
				elementTarget.children[4].innerText += "condition: " + WFC.SharedData.Mods[modID].condition;
				elementTarget.children[4].appendChild(document.createElement("br"));
			}

			var effects = modID === "modRiven" ? WFC.SharedData.Modding.Riven.effects : WFC.SharedData.Mods[modID].effects;
			var k = Object.keys(effects);
			for (let i = 0; i < k.length; i++) {
				let magnitude = effects[k[i]] * (1 + WFC.SharedData.Modding[group].Slots[index].Rank);
				if (magnitude >= 0) {
					elementTarget.children[4].innerText += "+";
				}
				if (k[i].indexOf("bonus") === 0 || k[i].indexOf("resist") === 0) {
					elementTarget.children[4].innerText += percentagestringFromFloat(magnitude, 0);
				} else {
					elementTarget.children[4].innerText += truncatedstringFromFloat(magnitude);
				}
				elementTarget.children[4].innerText += " " + WFC.Translate.translate(k[i]);

				elementTarget.children[4].appendChild(document.createElement("br"));
			}
			if (WFC.SharedData.Mods[modID].set) {
				elementTarget.children[4].innerText += WFC.Translate.translate(WFC.SharedData.Mods[modID].set);
				elementTarget.children[4].appendChild(document.createElement("br"));
			}


			elementTarget.children[5].innerText = WFC.Translate.translate(WFC.SharedData.Mods[modID].tag);
		} else {
			elementTarget.children[1].innerText = "";

			elementTarget.children[2].classList.add("hide");

			elementTarget.children[3].innerText = "";
			elementTarget.children[4].innerText = "";
			elementTarget.children[5].innerText = "";
		}
	}

	function cyclePolarity(group, index, direction) {
		WFC.SharedData.Modding[group].Slots[index].Polarity = Polarities[(Polarities.indexOf(WFC.SharedData.Modding[group].Slots[index].Polarity) + direction) % Polarities.length];

		drawModSlot(group, index);
		drawCapacity(group);

		return false;
	}

	function adjustModRank(group, index, direction) {
		WFC.SharedData.Modding[group].Slots[index].Rank = Math.max(0, Math.min(WFC.SharedData.Mods[WFC.SharedData.Modding[group].Slots[index].ModID].ranks, WFC.SharedData.Modding[group].Slots[index].Rank + direction));

		drawModSlot(group, index);
		drawCapacity(group);

		updateStatsum();
	}

	function moveMod(source, destination) {
		if (source === destination) {
			return false;
		}

		if (source.classList.contains("modSlot") && destination.classList.contains("modSlot")) {
			//Swapping the positions of two Mods
			let groupSource = source.getAttribute("data-category");
			let groupDestination = destination.getAttribute("data-category");

			if (groupSource !== groupDestination) {
				return false;
			}

			let indexSource = source.getAttribute("data-index");
			let indexDestination = destination.getAttribute("data-index");
			let rankDestination = WFC.SharedData.Modding[groupDestination].Slots[indexDestination].Rank;
			let modDestination = WFC.SharedData.Modding[groupDestination].Slots[indexDestination].ModID;

			WFC.SharedData.Modding[groupDestination].Slots[indexDestination].Rank = WFC.SharedData.Modding[groupSource].Slots[indexSource].Rank;
			WFC.SharedData.Modding[groupDestination].Slots[indexDestination].ModID = WFC.SharedData.Modding[groupSource].Slots[indexSource].ModID;
			WFC.SharedData.Modding[groupSource].Slots[indexSource].Rank = rankDestination;
			WFC.SharedData.Modding[groupSource].Slots[indexSource].ModID = modDestination;

			drawModSlot(groupSource, indexSource);
			drawModSlot(groupDestination, indexDestination);
			drawCapacity(groupSource);
		} else if (source.classList.contains("modSlot") && destination.classList.contains("editorInventoryListing")) {
			//Unequipping a Mod
			let group = source.getAttribute("data-category");
			let index = source.getAttribute("data-index");
			let modID = WFC.SharedData.Modding[group].Slots[index].ModID;
			document.getElementById(WFC.SharedData.Modding[group].Slots[index].ModID).parentElement.classList.remove("modTileVisibilityOverride");
			WFC.SharedData.Modding[group].Slots[index].ModID = null;

			drawModSlot(group, index);
			drawCapacity(group);
			source.draggable = false;
			if (modID === "modRiven") {
				WFC.RivenHandling.updateRivenFormVisibility();
			}
		} else if (source.classList.contains("modTile") && destination.classList.contains("modSlot")) {
			//Equipping a Mod from the "Inventory"
			let groupSource = source.getAttribute("data-category");
			let group = destination.getAttribute("data-category");

			if (groupSource !== group) {
				return false;
			}

			let index = destination.getAttribute("data-index");

			let modSource = source.getAttribute("data-modid");
			let modDestination = WFC.SharedData.Modding[group].Slots[index].ModID;
			if (modDestination) {
				document.getElementById(modDestination).parentElement.classList.remove("modTileVisibilityOverride");
			} else {
				if (WFC.SharedData.Mods[modSource].sharedID) {
					for (let i = 0; i < WFC.SharedData.Modding[group].Slots.length; i++) {
						if (WFC.SharedData.Modding[group].Slots[i].ModID && WFC.SharedData.Mods[WFC.SharedData.Modding[group].Slots[i].ModID] && WFC.SharedData.Mods[WFC.SharedData.Modding[group].Slots[i].ModID].sharedID === WFC.SharedData.Mods[modSource].sharedID) {
							return false;
						}
					}
				}
			}
			destination.draggable = true;

			WFC.SharedData.Modding[group].Slots[index].ModID = modSource;
			WFC.SharedData.Modding[group].Slots[index].Rank = WFC.SharedData.Mods[modSource].ranks;
			source.classList.add("modTileVisibilityOverride");

			drawModSlot(group, index);
			drawCapacity(group);
			if (modSource === "modRiven" || modDestination === "modRiven") {
				WFC.RivenHandling.updateRivenFormVisibility();
			}
		}

		updateStatsum();
		return true;
	}

	function sortModTiles() {
		var a = [];
		var k = Object.keys(WFC.SharedData.Mods);
		for (let i = 0; i < k.length; i++) {
			a.push({
				id: WFC.SharedData.Mods[k[i]].id,
				val: WFC.Translate.translate(WFC.SharedData.Mods[k[i]].id)
			});
		}
		a.sort((x, y) => (x.val>y.val?1:-1));
		for (let i = 0; i < a.length; i++) {
			document.getElementById(a[i].id).parentElement.style.order = i;
		}
	}

	function createModSlot(group, index) {
		var slot = document.createElement("div");
		slot.classList.add("modSlot");
		slot.setAttribute("data-category", group);
		slot.setAttribute("data-index", index);

		var polarity = document.createElement("span");
		polarity.classList.add("modSlotPolarity");
		polarity.onclick = (e) => { return cyclePolarity(group, index, 1) };
		polarity.oncontextmenu = (e) => { return cyclePolarity(group, index, -1) };

		var usage = document.createElement("span");
		usage.classList.add("modUsage");

		var rank = document.createElement("div");
		rank.classList.add("modRank");
		rank.classList.add("hide");

		var minus = document.createElement("button");
		minus.innerText = "-";
		minus.onclick = (e) => adjustModRank(group, index, -1);

		var rankCount = document.createElement("span");
		rankCount.innerText = "0/0";

		var plus = document.createElement("button");
		plus.innerText = "+";
		plus.onclick = (e) => adjustModRank(group, index, 1);

		rank.appendChild(minus);
		rank.appendChild(rankCount);
		rank.appendChild(plus);

		var name = document.createElement("div");
		name.classList.add("modName");

		var content = document.createElement("div");
		content.classList.add("modContent");

		var modGroup = document.createElement("div");
		modGroup.classList.add("modGroup");

		slot.appendChild(polarity);
		slot.appendChild(usage);
		slot.appendChild(rank);
		slot.appendChild(name);
		slot.appendChild(content);
		slot.appendChild(modGroup);

		slot.addEventListener("dragstart", DragHandler.start, false);
		slot.addEventListener("dragenter", DragHandler.enter, false);
		slot.addEventListener("dragover", DragHandler.over, false);
		slot.addEventListener("dragleave", DragHandler.leave, false);
		slot.addEventListener("dragend", DragHandler.end, false);
		slot.addEventListener("drop", DragHandler.drop, false);

		return slot;
	}
	
	function redrawSlot(group, i) {
		drawModSlot(group, i);
	}

	function redrawSlots(group) {
		for (let i = 0; i < WFC.SharedData.Modding.Weapon.Slots.length; i++) {
			drawModSlot(group, i);
		}		
	}
	
	function redrawWeaponModSlots() {
		redrawSlots("Weapon");
	}

	function initWeaponModSlots() {
		var editorWeaponModSlots = document.getElementById("editorWeaponModSlots");
		while (WFC.SharedData.Modding.Weapon.Slots.length < 8) {
			editorWeaponModSlots.appendChild(createModSlot("Weapon", WFC.SharedData.Modding.Weapon.Slots.length));
			WFC.SharedData.Modding.Weapon.Slots.push({
				"Polarity": Polarities[0],
				"ModID": null,
				"Rank": 0,
				"Element": editorWeaponModSlots.lastElementChild
			});
		}

		WFC.Translate.addHook(redrawWeaponModSlots);
	}

	function initWeaponModTiles() {
		var editorWeaponInventory = document.getElementById("editorWeaponInventory");
		var k = Object.keys(WFC.SharedData.Mods);
		for (let i = 0; i < k.length; i++) {
			let tile = document.createElement("div");
			tile.classList.add("modTile");
			tile.setAttribute("data-category", "Weapon");
			tile.setAttribute("data-modid", WFC.SharedData.Mods[k[i]].id);

			let cost = document.createElement("span");
			cost.innerText = (WFC.SharedData.Mods[k[i]].cost + WFC.SharedData.Mods[k[i]].ranks) + " " + WFC.SharedData.Mods[k[i]].polarity;

			let name = document.createElement("div");
			name.innerText = WFC.Translate.translate(WFC.SharedData.Mods[k[i]].id);
			name.id = WFC.SharedData.Mods[k[i]].id;

			tile.appendChild(cost);
			tile.appendChild(name);

			WFC.Translate.add(WFC.SharedData.Mods[k[i]].id, WFC.SharedData.Mods[k[i]].id, "innerText");

			tile.draggable = true;
			tile.addEventListener("dragstart", DragHandler.start, false);
			tile.addEventListener("dragend", DragHandler.end, false);

			editorWeaponInventory.appendChild(tile);
		}

		document.getElementById("editorWeaponInventoryFilterText").onchange = updateFiltering;
		document.getElementById("editorWeaponInventoryFilterText").onkeyup = updateFiltering;

		editorWeaponInventory.addEventListener("dragover", DragHandler.over, false);
		editorWeaponInventory.addEventListener("dragleave", DragHandler.leave, false);
		editorWeaponInventory.addEventListener("dragend", DragHandler.end, false);
		editorWeaponInventory.addEventListener("drop", DragHandler.drop, false);

		WFC.Translate.addHook(sortModTiles);
	}
	
	function initWeaponStatsSimple() {
		WFC.Translate.add("editorWeaponLabelCapacity", "labelCapacity", "innerText");
		let table = document.getElementById("editorWeaponStatsSimple");
		
		var generalStats = [
			"Accuracy",
			"CriticalChance",
			"CriticalMultiplier",
			"FallOff",
			"FireRate",
			"Magazine",
			"Noise",
			"PunchThrough",
			"Reload",
			"Disposition",
			"StatusChance",
			"Trigger"
		];
		var damageTypes = [
			"Impact",
			"Toxin",
			"Heat",
			"Electricity",
			"Slash",
			"Puncture",
			"Cold",
			"Gas",
			"Corrosive",
			"Radiation",
			"Blast",
			"Viral",
			"Magnetic"
		];
		
		for (let i = 0; i < generalStats.length; i++) {
			let row = document.createElement("tr");
			let label = document.createElement("td");
			label.id = "editorWeaponLabel" + generalStats[i];
			label.innerText = "label" + generalStats[i];
			row.appendChild(label);
			
			let value = document.createElement("td");
			value.id = "editorWeaponValue" + generalStats[i];
			row.appendChild(value);
			
			table.appendChild(row);
			WFC.Translate.add(label.id, label.innerText, "innerText");
		}
		
		{
			let row = document.createElement("tr");
			let spacer = document.createElement("td");
			spacer.colspan = "2";
			spacer.innerText = " ";
			row.appendChild(spacer);
			table.appendChild(row);
		}
		
		for (let i = 0; i < damageTypes.length; i++) {
			let row = document.createElement("tr");
			let label = document.createElement("td");
			label.id = "editorWeaponLabel" + damageTypes[i];
			label.innerText = "damage" + damageTypes[i];
			row.appendChild(label);
			
			let value = document.createElement("td");
			value.id = "editorWeaponValue" + damageTypes[i];
			row.appendChild(value);
			
			table.appendChild(row);
			WFC.Translate.add(label.id, label.innerText, "innerText");			
		}
	}

	function initData() {
		WFC.Util.debug("Modding.initData");
		WFC.SharedData.Mods = this.response.Mods;

		initWeaponModSlots();
		initWeaponModTiles();
		initWeaponStatsSimple();

		WFC.Translate.addHook(updateDamageCalcs);
	}

	var obj = {};

	obj.moveMod = moveMod;
	obj.redrawSlots = redrawSlots;
	obj.redrawSlot = redrawSlot;
	obj.updateModInventory = updateModInventory;

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
		let v = window.localStorage.getItem("lang");
		if (v === null) {
			window.localStorage.setItem("lang", "en");
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
	var selectWeapon;

	function changeWeaponSelect(e) {
		WFC.Util.debug("Weapons.changeWeaponSelect - " + e.target.value);
		if (Group === e.target.value) {
			return;
		}
		Group = e.target.value;

		var children = selectWeapon.children;
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
		selectWeapon.selectedIndex = 0;
	}

	function changeWeapon(e) {
		WFC.Util.debug("Weapons.changeWeapon - " + e.target.value);

		if (e.target.value === -1) {
			WFC.SharedData.Weapon = null;
			document.getElementById("editorWeaponName").innerText = "";
		} else {
			WFC.SharedData.Weapon = JSON.parse(JSON.stringify(Weapons.Weapons[e.target.value]));
			document.getElementById("editorWeaponName").innerText = WFC.SharedData.Weapon.Name;
		}
		WFC.Modding.updateModInventory();
		updateStatsum();
		updateMiscForm();
	}

	function initForm() {
		WFC.Util.debug("Weapons.initForm");

		document.getElementById(idForm).onsubmit = function () { return false; };

		var selectCategory = document.getElementById(idSelectGroup);

		var groups = Object.keys(Weapons.Tree);
		for (let iGroup = 0; iGroup < groups.length; iGroup++) {
			let eG = WFC.Util.addElement(selectCategory, "option", {
				"id": "optionWeaponGroup" + groups[iGroup],
				"value": groups[iGroup],
				"innerText": WFC.Translate.translate("weaponGroup" + groups[iGroup])
			});
			WFC.Translate.add(eG.id, "weaponGroup" + groups[iGroup], "innerText");

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
						"innerText": Weapons.Weapons[weapons[iWeapon]].Name
					});
				}
			}
		}

		selectCategory.onchange = changeWeaponSelect;

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
		selectWeapon = document.getElementById(idSelectWeapon);
		selectWeapon.addEventListener("change", changeWeapon);
		WFC.Translate.add("optionWeaponSelectBlank", "selectBlankWeapon", "innerText");
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
	WFC.RivenHandling.init();
	WFC.Translate.init();
});