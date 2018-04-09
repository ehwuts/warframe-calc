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
		set: "Vigilante",
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
			specialCritBleed: 0.05,
		},
		set : "Hunter",
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
}

var slots = [
	{ polarity: "", mod: null, rank: "" },
	{ polarity: "", mod: null, rank: "" },
	{ polarity: "", mod: null, rank: "" },
	{ polarity: "", mod: null, rank: "" },
	{ polarity: "", mod: null, rank: "" },
	{ polarity: "", mod: null, rank: "" },
	{ polarity: "", mod: null, rank: "" },
	{ polarity: "", mod: null, rank: "" },
];

var dragSrc = null;

function setSlot(slot, id, rank = null) {
	var i = slot.getAttribute("data-num");
	if (id) {
		if (rank !== null) {
			slots[i].rank = rank;
		} else {
			slots[i].rank = testMods[id].ranks;
		}
		slots[i].mod = id;
		let polarmatch = (slots[i].polarity?(slots[i].polarity==testMods[id].polarity?true:false):null);
		let cost = (slots[i].rank|0)+testMods[id].cost;
		slot.innerHTML = 
	'<div class="slotpolarity">' + slots[i].polarity +'</div>' +
	'<div class="slotrank"><button>-</button> '+slots[i].rank+'/'+testMods[id].ranks+' <button>+</button></div>' +
	'<div class="slotcost' +
	(polarmatch?(polarmatch?' green':' red'):'') + '">' + 
	(polarmatch?Math.ceil(polarmatch?cost/2.0:cost*1.25):cost) + ' ' + testMods[id].polarity +
	'</div>' +
	'<div class="slotname">'+id+'</div>' +
	'<div class="sloteffects">'+JSON.stringify(testMods[id].effects)+(testMods[id].set?'<br>'+testMods[id].set:'')+'</div>' +
	//id + "<br>" + JSON.stringify(testMods[id].effects)+(testMods[id].set?'<br>'+testMods[id].set:'') +
	'<div class="slotcategory">'+testMods[id].tag+'</div>';
		slot.draggable=true;
	} else {
		slots[i] = { polarity: slots[i].polarity, mod: null, rank: null };
		slot.innerHTML = '<div class="slotpolarity">' + slots[i].polarity +'</div>';
		slot.draggable = null;
	}
}

function swapSlots(a, b) {
	var i = slots[a.getAttribute("data-num")].mod;
	var ir = slots[a.getAttribute("data-num")].rank;
	setSlot(a, slots[b.getAttribute("data-num")].mod, slots[b.getAttribute("data-num")].rank);
	setSlot(b, i, ir);
}

function makeListVisible(id) {
	var search = document.querySelectorAll(".hide2");
	for (let i = 0; i < search.length; i++) {
		if (search[i].parentElement.id == "modslist" && search[i].innerText == id) {
			search[i].classList.remove("hide2");
			break;
		}			
	}
}

function handleDragStart(e) {
	dragSrc = this;
	//console.log(this);
	
	e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	
	e.dataTransfer.dropEffect = "move";
	
	return false;
}

function handleDragEnter(e) {
	this.classList.add("over");
}
function handleDragLeave(e) {
	this.classList.remove("over");
}
function handleDrop(e) {
	if (e.stopPropogation) {
		e.stopPropogation();
	}
	
	if (dragSrc != this && (dragSrc.classList.contains("slot") || this.classList.contains("slot"))) {
		if (dragSrc.parentElement.id == "modslist") {
			if (slots[this.getAttribute("data-num")].mod) {
				makeListVisible(slots[this.getAttribute("data-num")].mod);
			}
			setSlot(this, dragSrc.innerHTML);
			dragSrc.classList.add("hide2");
		} else if (this.parentElement.id == "modslist" || this.id == "modslist") {
			makeListVisible(slots[dragSrc.getAttribute("data-num")].mod);
			setSlot(dragSrc, null);
		} else {
			swapSlots(dragSrc, this);
		}
	}
	
	return false;
}
function handleDragEnd(e) {
	var tiles = document.querySelectorAll('.over');
	[].forEach.call(tiles, (tile) => {
		tile.classList.remove("over");
	});
	
	dragSrc = null;
}

function drawFormCustomProjectile() {
	var dest = document.getElementById("custom_projectile");
	dest.innerHTML = 
	"<form id='custom_projectile_form'>" +
	"<table>" +
	"<tr><td>" + "a" + "</td><td><input name='cprj_impact'></td></tr>" +
	"</table>" +
	"</form>";
}

function init() {
	var k = Object.keys(testMods);
	var dest = document.getElementById("modslist");
	
	for (let i = 0; i < k.length; i++) {
		let e = document.createElement("div");
		
		e.classList.add("tile");
		e.draggable = true;
		e.innerText = k[i];
		
		e.addEventListener('dragstart', handleDragStart, false);
		e.addEventListener('dragend', handleDragEnd, false);
		
		dest.appendChild(e);
	}
	dest.addEventListener('dragover', handleDragOver, false);
	dest.addEventListener('dragleave', handleDragLeave, false);
	dest.addEventListener('dragend', handleDragEnd, false);
	dest.addEventListener('drop', handleDrop, false);
	
	dest = document.getElementById("slots");
	for (let i = 0; i < slots.length; i++) {
		let e = document.createElement("div");
		e.classList.add("slot");
		e.setAttribute("data-num", i);
		
		e.addEventListener('dragstart', handleDragStart, false);
		e.addEventListener('dragenter', handleDragEnter, false);
		e.addEventListener('dragover', handleDragOver, false);
		e.addEventListener('dragleave', handleDragLeave, false);
		e.addEventListener('dragend', handleDragEnd, false);
		e.addEventListener('drop', handleDrop, false);
		
		dest.appendChild(e);
	}
}

window.addEventListener("load", init);