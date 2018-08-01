var testMods = {
	"Serration": {
		tag : "Rifle",
		cost : 4,
		ranks : 10,
		polarity: "V",
		effects : {
			bonusDamage : 0.15,
		},
	},
	"Point Strike": {
		tag : "Rifle",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusCritChance : 0.25,
		},		
	},
	"Vital Sense": {
		tag : "Rifle",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusCritDamage : 0.2,
		},		
	},
	"Vigilante Armaments": {
		tag : "Primary",
		cost : 4,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusMultishot : 0.1,
		},
		set: "setVigilante",
	},
	"Hellfire": {
		tag : "Rifle",
		cost : 6,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusHeat : 0.15,
		},		
	},
	"Stormbringer": {
		tag : "Rifle",
		cost : 6,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusElectric : 0.15,
		},		
	},
	"Split Chamber": {
		tag : "Rifle",
		cost : 10,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusMultishot : 0.15,
		},		
	},
	"Cryo Rounds": {
		tag : "Rifle",
		cost : 6,
		ranks : 5,
		polarity: "D",
		effects : {
			bonusCold : 0.15,
		},		
	},
	"Infected Clip": {
		tag : "Rifle",
		cost : 6,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusToxin : 0.15,
		},		
	},
	"Primed Cryo Rounds": {
		tag : "Rifle",
		cost : 6,
		ranks : 10,
		polarity: "—",
		effects : {
			bonusCold : 0.15,
		},
		conflicts: ["Cryo Rounds"],
	},
	"Hunter Munitions": {
		tag : "Primary",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			specialHunterMunitions: 0.05,
		},
		set : "setHunter",
	},
	"Heavy Caliber": {
		tag : "Rifle",
		cost : 6,
		ranks : 10,
		polarity: "V",
		effects : {
			bonusDamage : 0.15,
			bonusAccuracy: -0.05,
		},		
	},
	"High Voltage": {
		tag : "Rifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusElectric: 0.15,
			bonusStatus: 0.15,
		},		
	},
	"Malignant Force": {
		tag : "Rifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusToxin: 0.15,
			bonusStatus: 0.15,
		},		
	},
	"Rime Rounds": {
		tag : "Rifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusCold: 0.15,
			bonusStatus: 0.15,
		},		
	},
	"Thermite Rounds": {
		tag : "Rifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusHeat: 0.15,
			bonusStatus: 0.15,
		},		
	},
	"Rifle Aptitude": {
		tag : "Rifle",
		cost : 4,
		ranks : 5,
		polarity: "D",
		effects : {
			bonusStatus: 0.025,
		},		
	},
	"Shred": {
		tag : "Rifle",
		cost : 6,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusFireRate: 0.05,
			flatPunchThrough: 0.2,
		},		
	},
	"Primed Shred": {
		tag : "Rifle",
		cost : 6,
		ranks : 10,
		polarity: "V",
		effects : {
			bonusFireRate: 0.05,
			flatPunchThrough: 0.2,
		},		
		conflicts: ["Shred"],
	},
	"Speed Trigger": {
		tag : "Rifle",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusFireRate: 0.1,
		},		
	},
	"Vile Acceleration": {
		tag : "Rifle",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusFireRate: 0.15,
			bonusDamage: -0.025,
		},		
	},
};