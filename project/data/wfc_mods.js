var testMods = {
	"modSerration": {
		tag : "Rifle",
		cost : 4,
		ranks : 10,
		polarity: "V",
		effects : {
			bonusDamage : 0.15,
		},
	},
	"modPointStrike": {
		tag : "Rifle",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusCritChance : 0.25,
		},		
	},
	"modVitalSense": {
		tag : "Rifle",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusCritDamage : 0.2,
		},		
	},
	"modVigilanteArmaments": {
		tag : "Primary",
		cost : 4,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusMultishot : 0.1,
		},
		set: "setVigilante",
	},
	"modHellfire": {
		tag : "Rifle",
		cost : 6,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusHeat : 0.15,
		},		
	},
	"modStormbringer": {
		tag : "Rifle",
		cost : 6,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusElectric : 0.15,
		},		
	},
	"modSplitChamber": {
		tag : "Rifle",
		cost : 10,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusMultishot : 0.15,
		},		
	},
	"modCryoRounds": {
		tag : "Rifle",
		cost : 6,
		ranks : 5,
		polarity: "D",
		effects : {
			bonusCold : 0.15,
		},		
	},
	"modInfectedClip": {
		tag : "Rifle",
		cost : 6,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusToxin : 0.15,
		},		
	},
	"modPrimedCryoRounds": {
		tag : "Rifle",
		cost : 6,
		ranks : 10,
		polarity: "—",
		effects : {
			bonusCold : 0.15,
		},
		conflicts: ["modCryoRounds"],
	},
	"modHunterMunitions": {
		tag : "Primary",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			specialeffectHunterMunitions: 0.05,
		},
		set : "setHunter",
	},
	"modHeavyCaliber": {
		tag : "Rifle",
		cost : 6,
		ranks : 10,
		polarity: "V",
		effects : {
			bonusDamage : 0.15,
			bonusAccuracy: -0.05,
		},		
	},
	"modHighVoltage": {
		tag : "Rifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusElectric: 0.15,
			bonusStatusChance: 0.15,
		},		
	},
	"modMalignantForce": {
		tag : "Rifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusToxin: 0.15,
			bonusStatusChance: 0.15,
		},		
	},
	"modRimeRounds": {
		tag : "Rifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusCold: 0.15,
			bonusStatusChance: 0.15,
		},		
	},
	"modThermiteRounds": {
		tag : "Rifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusHeat: 0.15,
			bonusStatusChance: 0.15,
		},		
	},
	"modRifleAptitude": {
		tag : "Rifle",
		cost : 4,
		ranks : 5,
		polarity: "D",
		effects : {
			bonusStatusChance: 0.025,
		},		
	},
	"modShred": {
		tag : "Rifle",
		cost : 6,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusFireRate: 0.05,
			flatPunchThrough: 0.2,
		},		
	},
	"modPrimedShred": {
		tag : "Rifle",
		cost : 6,
		ranks : 10,
		polarity: "V",
		effects : {
			bonusFireRate: 0.05,
			flatPunchThrough: 0.2,
		},		
		conflicts: ["modShred"],
	},
	"modSpeedTrigger": {
		tag : "Rifle",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusFireRate: 0.1,
		},		
	},
	"modVileAcceleration": {
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