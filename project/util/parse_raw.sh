#!/usr/bin/env node

var fs = require("fs");
var path = require("path");

var generate = {
	"Weapons": true,
	"Mods": true
};

var dirDataWeapons = "../raw/weapons/";
var dirDataMods = "../raw/mods/";
var dirOut = "./data/";

var outfileWeapons = "WeaponData.json";
var outfileMods = "ModData.json";

if (generate.Weapons) {
	console.log("Generating combined Weapons JSON");
	var Weapons = {"Weapons":{}, "Tree": {}};
	var WeaponIDs = {};

	var files = fs.readdirSync(dirDataWeapons);
	for (let k = 0; k < files.length; k++) {
		var dir = path.join(dirDataWeapons, files[k]);
		if (fs.statSync(dir).isDirectory()) {
			var count = 0;
			var files2 = fs.readdirSync(dir).filter(name => name.endsWith(".json"));
			for (let i = 0; i < files2.length; i++) {
				let filepath = path.join(dir, files2[i]);
				let textContent = fs.readFileSync(filepath);
				try {
					let weapondata = JSON.parse(textContent);
					if (WeaponIDs[weapondata.Name]) {
						console.log("Warning: ", filename, "contains definition for", weaponData.Name, "which already has a definition from", WeaponIDs[weapondata.Name]);
					} else {
						WeaponIDs[weapondata.Name] = filepath;
					}
					Weapons.Weapons[files2[i].slice(0, -5)] = JSON.parse(JSON.stringify(weapondata));
					if (!Weapons.Tree[weapondata.Group]) {
						Weapons.Tree[weapondata.Group] = {};
					}
					if (!Weapons.Tree[weapondata.Group][weapondata.SubGroup]) {
						Weapons.Tree[weapondata.Group][weapondata.SubGroup] = [];
					}
					Weapons.Tree[weapondata.Group][weapondata.SubGroup].push(files2[i].slice(0, -5));
					Weapons.Tree[weapondata.Group][weapondata.SubGroup].sort();
					count++;
				} catch (e) {
					console.log("Failed to parse ", filepath);
				}
			}
			console.log(count + " " + files[k]);
		};
	};
	fs.writeFileSync(path.join(dirOut, outfileWeapons), JSON.stringify(Weapons));
}
if (generate.Mods) {
	console.log("Generating combined Mods JSON");
	var Mods = {"Mods":{}, "Tree": {}};
	var ModIDs = {};

	var files = fs.readdirSync(dirDataMods);
	for (let k = 0; k < files.length; k++) {
		var dir = path.join(dirDataMods, files[k]);
		if (fs.statSync(dir).isDirectory()) {
			var count = 0;
			var files2 = fs.readdirSync(dir).filter(name => name.endsWith(".json"));
			for (let i = 0; i < files2.length; i++) {
				let filepath = path.join(dir, files2[i]);
				let textContent = fs.readFileSync(filepath);
				try {
					let moddata = JSON.parse(textContent);
					if (ModIDs[moddata.id]) {
						console.log("Warning: ", filename, "contains definition for", moddata.id, "which already has a definition from", ModIDs[moddata.id]);
					} else {
						ModIDs[moddata.id] = filepath;
					}
					Mods.Mods[moddata.id] = JSON.parse(JSON.stringify(moddata));
					if (!Mods.Tree[moddata.group]) {
						Mods.Tree[moddata.group] = [];
					}
					Mods.Tree[moddata.group].push(moddata.id);
					Mods.Tree[moddata.group].sort();
					count++;
				} catch (e) {
					console.log("Failed to parse ", filepath);
				}
			}
			console.log(count + " " + files[k]);
		};
	};
	fs.writeFileSync(path.join(dirOut, outfileMods), JSON.stringify(Mods));
}