var slots = [];
//{ polarity: '', mod: null, rank: '' }
var slotsCount = 8;

var statsum = {};

var dragSrc = null;

function updateStatsum() {
	var newStatsum = {};
	for (var m = 0; m < slots.length; m++) {
		if (slots[m].mod && testMods[slots[m].mod]) {
			let mod = testMods[slots[m].mod];
			let k = Object.keys(mod.effects);
			for (let i = 0; i < k.length; i++) {
				let magnitude = mod.effects[k[i]] * (slots[m].rank + 1);
				if (newStatsum[k[i]]) {
					newStatsum[k[i]] += magnitude;
				} else {
					newStatsum[k[i]] = magnitude;
				}
			}
			if (mod.set) {
				if (newStatsum[mod.set]) {
					newStatsum[mod.set] ++;
				} else {
					newStatsum[mod.set]  = 1;
				}
			}
		}
	}
	
	statsum = newStatsum;
	document.getElementById('testdiv').innerHTML = JSON.stringify(statsum,null,2);
}

function describeMod(id, rank = null) {
	var result = '';
	var mod = testMods[id];
	if (mod) {
		if (!rank) {
			rank = 0;
		}
		rank = Math.max(0, Math.min(mod.ranks, rank));
		var k = Object.keys(mod.effects);
		for (let i = 0; i < k.length; i++) {
			result += k[i] + ': ' + mod.effects[k[i]] * (rank + 1) + '<br>';
		}
		if (mod.set) {
			result += 'Set - ' + mod.set;
		}
	}	
	return result;
}

function slotAdjust(slot, delta) {
	var i = slot.getAttribute('data-num');
	var id = slots[i].mod;
	slots[i].rank = Math.max(0, Math.min(testMods[id].ranks, slots[i].rank + delta));
	slot.children[1].children[1].innerText = slots[i].rank+'/'+testMods[id].ranks;
	
	let costadj = (slots[i].rank|0)+testMods[id].cost;
	costadj = (slots[i].polarity?Math.ceil(slots[i].polarity==testMods[id].polarity?costadj/2.0:costadj*1.25):costadj);
	slot.children[2].innerText = costadj + ' ' + testMods[id].polarity;
	slot.children[4].innerHTML = describeMod(id, slots[i].rank);
	
	updateStatsum();
}

function setSlot(slot, id, rank = null) {
	var i = slot.getAttribute("data-num");
	if (id) {
		if (rank !== null) {
			slots[i].rank = rank;
		} else {
			slots[i].rank = testMods[id].ranks;
		}
		slots[i].mod = id;
		let polarmatch = (slots[i].polarity?(slots[i].polarity==testMods[id].polarity?' polaritymatch':' polarityconflict'):'');
		let cost = (slots[i].rank|0)+testMods[id].cost;
		let costadj = (slots[i].polarity?Math.ceil(slots[i].polarity==testMods[id].polarity?cost/2.0:cost*1.25):cost);
		
		slot.children[0].innerText = slots[i].polarity;
		slot.children[1].className = 'slotrank';
		slot.children[1].children[1].innerText = slots[i].rank+'/'+testMods[id].ranks;
		slot.children[2].className = 'slotcost' + polarmatch;
		slot.children[2].innerText = costadj + ' ' + testMods[id].polarity;
		slot.children[3].innerText = id;
		slot.children[4].innerHTML = describeMod(id, slots[i].rank);
		slot.children[5].innerText = testMods[id].tag;
		slot.draggable=true;
	} else {
		slots[i] = { polarity: slots[i].polarity, mod: null, rank: null };
		slot.children[0].innerText = slots[i].polarity;
		slot.children[1].className = 'slotrank hide';
		slot.children[2].className = 'slotcost';
		slot.children[2].innerText = '';
		slot.children[3].innerText = '';
		slot.children[4].innerText = '';
		slot.children[5].innerText = '';
		slot.draggable = null;
	}
	
	updateStatsum();
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

var DragHandler = {
	'enter': function handleDragEnter(e) {
		this.classList.add("over");
	},
	'start': function handleDragStart(e) {
		dragSrc = this;
		//console.log(this);
		
		e.dataTransfer.effectAllowed = "move";
	},
	'over': function handleDragOver(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		
		e.dataTransfer.dropEffect = "move";
		
		return false;
	},
	'leave': function handleDragLeave(e) {
		this.classList.remove("over");
	},
	'drop': function handleDrop(e) {
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
	},
	'end': function handleDragEnd(e) {
		var tiles = document.querySelectorAll('.over');
		[].forEach.call(tiles, (tile) => {
			tile.classList.remove("over");
		});
		
		dragSrc = null;
	}
};

function initializeModsList() {
	var k = Object.keys(testMods);
	var dest = document.getElementById("modslist");
	
	for (let i = 0; i < k.length; i++) {
		let e = document.createElement("div");
		
		e.classList.add("tile");
		e.draggable = true;
		e.innerText = k[i];
		
		e.addEventListener('dragstart', DragHandler.start, false);
		e.addEventListener('dragend', DragHandler.end, false);
		
		dest.appendChild(e);
	}
	dest.addEventListener('dragover', DragHandler.over, false);
	dest.addEventListener('dragleave', DragHandler.leave, false);
	dest.addEventListener('dragend', DragHandler.end, false);
	dest.addEventListener('drop', DragHandler.drop, false);	
}

function initializeModSlots() {
	for (let i = 0; i < slotsCount; i++) {
		slots[i] = { polarity: '', mod: null, rank: '' };
	}
	
	var dest = document.getElementById("slots");
	for (let i = 0; i < slots.length; i++) {
		let e = document.createElement("div");
		e.classList.add("slot");
		e.setAttribute("data-num", i);
		
		e.addEventListener('dragstart', DragHandler.start, false);
		e.addEventListener('dragenter', DragHandler.enter, false);
		e.addEventListener('dragover', DragHandler.over, false);
		e.addEventListener('dragleave', DragHandler.leave, false);
		e.addEventListener('dragend', DragHandler.end, false);
		e.addEventListener('drop', DragHandler.drop, false);
		
		let ee = document.createElement('div');
		ee.className = 'slotpolarity';
		e.appendChild(ee);
		
		ee = document.createElement('div');
		ee.className = 'slotrank hide';
		let eee = document.createElement('button');
		eee.innerText = '-';
		eee.onclick = (e) => slotAdjust(e.target.parentElement.parentElement, -1);
		ee.appendChild(eee);
		eee = document.createElement('span');
		eee.innerText = '0/0';
		ee.appendChild(eee);
		eee = document.createElement('button');
		eee.innerText = '+';
		eee.onclick = (e) => slotAdjust(e.target.parentElement.parentElement, 1);
		ee.appendChild(eee);		
		e.appendChild(ee);
		
		ee = document.createElement('div');
		ee.className = 'slotcost';
		e.appendChild(ee);
		
		ee = document.createElement('div');
		ee.className = 'slotname';
		e.appendChild(ee);
		
		ee = document.createElement('div');
		ee.className = 'sloteffects';
		e.appendChild(ee);
		
		ee = document.createElement('div');
		ee.className = 'slotcategory';
		e.appendChild(ee);
		
		dest.appendChild(e);
	}	
}

function init() {
	initializeModsList();
	initializeModSlots();
}

window.addEventListener("load", init);