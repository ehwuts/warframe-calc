var weapons = {
	'Baza': {
		name: 'Baza',
		type: ['weaponTypePrimary', 'weaponTypeRifle'],
		
		attacks: [
			{
				attackName: 'primary',
				trigger: 'triggerAuto',			
				noise: 'noiseSilent',
				
				'statFireRate': 16.67,
				'statAccuracy': 80,
				'statMagazine': 40,
				'statAmmo': 800,
				'statReload': 1.4,
				
				damage:[
					['damageImpact', 5.8],
					['damagePuncture', 6.7],
					['damageSlash', 3.5]
				],
				
				'statCritChance': 0.26,
				'statCritDamage': 3,
				'statStatusChance': 0.10,
				
				falloff:[22, 34, 0.5]
			}
		]
	}
};

var mods = {
	"modSerration": {
		tag : "weaponTypeRifle",
		cost : 4,
		ranks : 10,
		polarity: "V",
		effects : {
			bonusDamage : 0.15,
		},
	},
	"modPointStrike": {
		tag : "weaponTypeRifle",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusCritChance : 0.25,
		},		
	},
	"modVitalSense": {
		tag : "weaponTypeRifle",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusCritDamage : 0.2,
		},		
	},
	"modVigilanteArmaments": {
		tag : "weaponTypePrimary",
		cost : 4,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusMultishot : 0.1,
		},
		set: "setVigilante",
	},
	"modHellfire": {
		tag : "weaponTypeRifle",
		cost : 6,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusHeat : 0.15,
		},		
	},
	"modStormbringer": {
		tag : "weaponTypeRifle",
		cost : 6,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusElectric : 0.15,
		},		
	},
	"modSplitChamber": {
		tag : "weaponTypeRifle",
		cost : 10,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusMultishot : 0.15,
		},		
	},
	"modCryoRounds": {
		tag : "weaponTypeRifle",
		cost : 6,
		ranks : 5,
		polarity: "D",
		effects : {
			bonusCold : 0.15,
		},		
	},
	"modInfectedClip": {
		tag : "weaponTypeRifle",
		cost : 6,
		ranks : 5,
		polarity: "—",
		effects : {
			bonusToxin : 0.15,
		},		
	},
	"modPrimedCryoRounds": {
		tag : "weaponTypeRifle",
		cost : 6,
		ranks : 10,
		polarity: "—",
		effects : {
			bonusCold : 0.15,
		},
		conflicts: ["modCryoRounds"],
	},
	"modHunterMunitions": {
		tag : "weaponTypePrimary",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			specialeffectHunterMunitions: 0.05,
		},
		set : "setHunter",
	},
	"modHeavyCaliber": {
		tag : "weaponTypeRifle",
		cost : 6,
		ranks : 10,
		polarity: "V",
		effects : {
			bonusDamage : 0.15,
			bonusAccuracy: -0.05,
		},		
	},
	"modHighVoltage": {
		tag : "weaponTypeRifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusElectric: 0.15,
			bonusStatusChance: 0.15,
		},		
	},
	"modMalignantForce": {
		tag : "weaponTypeRifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusToxin: 0.15,
			bonusStatusChance: 0.15,
		},		
	},
	"modRimeRounds": {
		tag : "weaponTypeRifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusCold: 0.15,
			bonusStatusChance: 0.15,
		},		
	},
	"modThermiteRounds": {
		tag : "weaponTypeRifle",
		cost : 4,
		ranks : 3,
		polarity: "V",
		effects : {
			bonusHeat: 0.15,
			bonusStatusChance: 0.15,
		},		
	},
	"modRifleAptitude": {
		tag : "weaponTypeRifle",
		cost : 4,
		ranks : 5,
		polarity: "D",
		effects : {
			bonusStatusChance: 0.025,
		},		
	},
	"modShred": {
		tag : "weaponTypeRifle",
		cost : 6,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusFireRate: 0.05,
			flatPunchThrough: 0.2,
		},		
	},
	"modPrimedShred": {
		tag : "weaponTypeRifle",
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
		tag : "weaponTypeRifle",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusFireRate: 0.1,
		},		
	},
	"modVileAcceleration": {
		tag : "weaponTypeRifle",
		cost : 4,
		ranks : 5,
		polarity: "V",
		effects : {
			bonusFireRate: 0.15,
			bonusDamage: -0.025,
		},		
	},
};