var items = {
	'Baza': {
		name: 'Baza',
		type: ['weaponTypePrimary', 'weaponTypeRifle'],
		rivenDisposition: 1.1,
		
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
				'statPunchThrough': 0,
				'statProjectiles': 1,
				
				damage:{
					'damageImpact': 5.8,
					'damagePuncture': 6.7,
					'damageSlash': 3.5
				},
				
				'statCritChance': 0.26,
				'statCritDamage': 3,
				'statStatusChance': 0.10,
				
				falloff:[22, 34, 0.5]
			}
		]
	},
	'Supra_Vandal':{
		name: 'Supra Vandal',
		type: ['weaponTypePrimary', 'weaponTypeRifle'],
		rivenDisposition: 1.14,
		
		attacks: [
			{
				attackName: 'primary',
				trigger: 'triggerAutoSpool',			
				noise: 'noiseAlarming',
				
				'statFireRate': 12.5,
				'statAccuracy': 26.6,
				'statMagazine': 300,
				'statAmmo': 1600,
				'statReload': 3.0,
				'statPunchThrough': 0,
				'statProjectiles': 1,
				
				damage:{
					'damageImpact': 4.0,
					'damagePuncture': 30.0,
					'damageSlash': 6.0
				},
				
				'statCritChance': 0.16,
				'statCritDamage': 2,
				'statStatusChance': 0.30
			}
		]
	},
	'Lanka': {
		type: ['weaponTypePrimary', 'weaponTypeSniper', 'weaponTypeRifle'],
		rivenDisposition: 1.1,
		
		attacks: [
			{
				attackName: 'Charged Shot',
				trigger: 'triggerCharge',			
				noise: 'noiseAlarming',
				
				'statFireRate': 1,
				'statAccuracy': 100,
				'statMagazine': 10,
				'statAmmo': 72,
				'statReload': 2.0,
				'statPunchThrough': 5,
				'statProjectiles': 1,
				
				'statComboDecay' : 6,
				
				zoom: [
					{'statZoom': 3, effects : { 'flatCritChance': .2 }},
					{'statZoom': 5, effects : { 'flatCritChance': .3 }},
					{'statZoom': 8, effects : { 'flatCritChance': .5 }}
				],
				
				damage:{
					'damageElectricity': 525
				},
				
				'statCritChance': 0.25,
				'statCritDamage': 2,
				'statStatusChance': 0.25
			},
			{
				attackName: 'Uncharged Shot',
				trigger: 'triggerCharge',			
				noise: 'noiseAlarming',
				
				'statFireRate': 0.33,
				'statAccuracy': 100,
				'statMagazine': 10,
				'statAmmo': 72,
				'statReload': 2.0,
				'statPunchThrough': 5,
				'statProjectiles': 1,
				
				'statComboDecay' : 6,
				
				zoom: [
					{'statZoom': 3, effects : { 'flatCritChance': .2 }},
					{'statZoom': 5, effects : { 'flatCritChance': .3 }},
					{'statZoom': 8, effects : { 'flatCritChance': .5 }}
				],
				
				damage:{
					'damageElectricity': 200
				},
				
				'statCritChance': 0.25,
				'statCritDamage': 2,
				'statStatusChance': 0.25
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
			bonusElectricity : 0.15,
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
			bonusElectricity: 0.15,
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