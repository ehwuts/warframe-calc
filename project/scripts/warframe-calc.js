var dataSets = ['datasetPrimary', 'datasetSecondary', 'datasetMelee', 'datasetWarframe', 'datasetCompanion', 'datasetArchwing', 'datasetArchgun', 'datasetArchmelee'];

var slots = [];
//{ polarity: '', mod: null, rank: '' }
var slotsCount = 8;

var statsum = {};

function percentagestringFromFloat(f) {
	f *= 100;
	if (f > 0) f += 0.00001;
	else f -= 0.00001;
	let r = (f + ' ').substring(0, 3);
	if (r[2] == '.') {
		r = r.substring(0, 2);
	}
	return r + '%';
}
function truncatedstringFromFloat(f) {
	if (f > 0) f += 0.00001;
	else f -= 0.00001;	
	let r = (f + ' ').substring(0, 4);
	return r;
}
function modCostFromSlot(i) {
	var id = slots[i].mod;
	if (id) {
		let costadj = (slots[i].rank|0)+mods[id].cost;
		costadj = (slots[i].polarity?Math.ceil(slots[i].polarity==mods[id].polarity?costadj/2.0:costadj*1.25):costadj);
		
		return costadj;
	}
	return 0;
}

function updateStatsum() {
	var newStatsum = {};
	var capacitySum = 0;
	
	for (var m = 0; m < slots.length; m++) {
		if (slots[m].mod && mods[slots[m].mod]) {
			let mod = mods[slots[m].mod];
			let k = Object.keys(mod.effects);
			for (let i = 0; i < k.length; i++) {
				let adj = mod.effects[k[i]] * (slots[m].rank + 1);
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
	
	statsum = newStatsum;
	document.getElementById('testdiv').innerHTML = JSON.stringify(statsum,null,2);
	
	document.getElementById('capacity').innerText = capacitySum + '/60';
}

function describeMod(id, rank = null) {
	var result = '';
	var mod = mods[id];
	if (mod) {
		if (!rank) {
			rank = 0;
		}
		rank = Math.max(0, Math.min(mod.ranks, rank));
		var k = Object.keys(mod.effects);
		for (let i = 0; i < k.length; i++) {
			let adj = mod.effects[k[i]] * (rank + 1);
			result += (adj>0?'+':'') + (k[i].indexOf('bonus') === 0?percentagestringFromFloat(adj):truncatedstringFromFloat(adj))  + ' ' + Localization.translate(k[i]) + '<br>';
		}
		if (mod.set) {
			result += Localization.translate(mod.set);
		}
	}	
	return result;
}

function slotAdjust(slot, delta) {
	var i = slot.getAttribute('data-num');
	var id = slots[i].mod;
	slots[i].rank = Math.max(0, Math.min(mods[id].ranks, slots[i].rank + delta));
	slot.children[1].children[1].innerText = slots[i].rank+'/'+mods[id].ranks;
	
	let costadj = modCostFromSlot(i);
	slot.children[2].innerText = costadj + ' ' + mods[id].polarity;
	slot.children[4].innerHTML = describeMod(id, slots[i].rank);
	
	updateStatsum();
}

function setSlot(slot, id, rank = null) {
	var i = slot.getAttribute("data-num");
	if (id) {
		if (rank !== null) {
			slots[i].rank = rank;
		} else {
			slots[i].rank = mods[id].ranks;
		}
		slots[i].mod = id;
		let polarmatch = (slots[i].polarity?(slots[i].polarity==mods[id].polarity?' polaritymatch':' polarityconflict'):'');
		let costadj = modCostFromSlot(i);
		
		slot.children[0].innerText = slots[i].polarity;
		slot.children[1].className = 'slotrank';
		slot.children[1].children[1].innerText = slots[i].rank+'/'+mods[id].ranks;
		slot.children[2].className = 'slotcost' + polarmatch;
		slot.children[2].innerText = costadj + ' ' + mods[id].polarity;
		slot.children[3].innerText = Localization.translate(id);
		slot.children[4].innerHTML = describeMod(id, slots[i].rank);
		slot.children[5].innerText = Localization.translate(mods[id].tag);
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
	var search = document.querySelector('#modslist [data-modid="'+id+'"]');
	if (search) {
		search.classList.remove('hide2');
	}
}
function makeListInvisible(id) {
	var search = window.document.querySelector('#modslist [data-modid="'+id+'"]');
	if (search) {
		search.classList.add('hide2');
	}
}

var DragHandler = (function(window, undefined){
	var dragSrc = null;
	
	return {
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
					} else {					
						for (let i = 0; i < slots.length; i++) {
							let conflicts = mods[dragSrc.getAttribute('data-modid')].conflicts;
							let conflicts2 = slots[i].mod && mods[slots[i].mod].conflicts;
							if (slots[i].mod && ((conflicts2 && conflicts2.indexOf(dragSrc.getAttribute('data-modid')) != -1) || (conflicts && conflicts.indexOf(slots[i].mod) != -1))) {
								return false;
							}
						}
					}
					setSlot(this, dragSrc.getAttribute('data-modid'));
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
})(window);

function reloadSlots() {
	var ss = document.getElementById('slots').children;
	for (let i = 0; i < slots.length; i++) {
		setSlot(ss[i], slots[i].mod, slots[i].rank);
	}
}

function sortModsList() {
	var a = [];
	var p = document.getElementById('modslist').children;
	for (let i = 0; i < p.length; i++) {
		let mod = p[i].getAttribute('data-modid');
		a.push({id: mod, hide: p[i].classList.contains('hide2'), val: Localization.translate(mod)});
	}
	a.sort((x, y) => (x.val>y.val?1:-1));
	for (let i = 0; i < a.length; i++) {
		p[i].setAttribute('data-modid', a[i].id);
		p[i].innerText = a[i].val;
		if (a[i].hide) {
			makeListInvisible(a[i].id);
		} else {
			makeListVisible(a[i].id);
		}
	}
}

function initializeModsList() {
	var k = Object.keys(mods);
	var dest = document.getElementById("modslist");
	
	for (let i = 0; i < k.length; i++) {
		let e = document.createElement("div");
		e.setAttribute("data-modid", k[i]);
		
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
	
	sortModsList();
}

function reinitializeModsList() {
	var m = document.getElementById('modslist');
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

var Localization = (function(pathSrc, idSrc, idSelect, window, undefined){
	var locales = {
		'en': 'English', 
		'fr': 'Français',
		//'it': 'Italiano',
		//'de': 'Deutsch',
		'sp': 'Español',
		//'pt': 'Português',
		//'ru': 'Pусский',
		//'pl': 'Polski',
		//'uk': 'Українська',
		//'tr': 'Türkçe',
		//'jp': '日本語',
		//'zh-CN': '中文',
		//'ko': '한국어'
	};
	var localeRegex = /^[a-z][a-z](?:-[a-z][a-z])?$/i;
	var language = 'en';
	var dict = i18n.create();
	var thingsToUpdate = [];
	
	function applyLang() {		
		language = lang.code;
		window.document.children[0].lang = language;
		dict = i18n.create(lang);
		
		for (let i = 0; i < thingsToUpdate.length; i++) {
			thingsToUpdate[i]();
		}
	}
	
	function requestLang(e) {
		var newlanguage = e.target.value;
		if (language !== newlanguage) {
			var r = document.getElementById(idSrc);
			r.parentElement.removeChild(r);
			var e = document.createElement('script');
			e.id = idSrc;
			e.onload = applyLang;
			e.src = pathSrc + 'lang.' + newlanguage + '.js';
			document.body.appendChild(e);
			
			if (!!window.localStorage) {
				window.localStorage.setItem('lang', newlanguage);
			}
		}
	}	
	
	if (!!window.localStorage) {
		let v = window.localStorage.getItem('lang');
		if (v === null) {
			window.localStorage.setItem('lang', language);
		}
	}
	
	var obj = {};
	
	obj.translate = function (k) {
		return dict(k);
	};
	obj.addUpdate = function (f) {
		thingsToUpdate.push(f);
	};
	
	obj.init = function () {
		var ls = window.document.getElementById(idSelect);
		var newlanguage = language;
		
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
		applyLang();
		
		if (lang.code !== newlanguage) {
			requestLang({target:{value:newlanguage}});
		}
	}
	return obj;
})('project/data/lang/', 'langsrc', 'lang_select', window);

function init() {
	Localization.addUpdate(reloadSlots);
	Localization.addUpdate(sortModsList);
	Localization.init();
	initializeModsList();
	initializeModSlots();
}

window.addEventListener('load', init);