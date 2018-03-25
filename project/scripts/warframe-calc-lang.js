/* dictionary -> interface */
;(function(window, undefined) {
	var mappings = {
		"lbl_impact" : "impact",
		"lbl_puncture" : "puncture",
		"lbl_slash" : "slash",
		"lbl_cold" : "cold",
		"lbl_electricity" : "electricity",
		"lbl_heat" : "heat",
		"lbl_toxin" : "toxin",
		"lbl_blast" : "blast",
		"lbl_corrosive" : "corrosive",
		"lbl_gas" : "gas",
		"lbl_magnetic" : "magnetic",
		"lbl_radiation" : "radiation",
		"lbl_viral" : "viral",
		"lbl_accuracy" : "accuracy",
		"lbl_chargespeed" : "charge_rate",
		"lbl_critchance" : "critical_chance",
		"lbl_critmulti" : "critical_multiplier",
		"lbl_firerate" : "fire_rate",
		"lbl_statuschance" : "status",
		"lbl_magazine" : "magazine",
		"lbl_reload" : "reload"
	};
	
	var obj = {};
	
	obj.translator = null;	
	
	function performFullPageUpdate() {
		var k = Object.keys(mappings);
		for (let i = 0; i < k.length; i++) {
			window.document.getElementById(k[i]).innerHTML = obj.translator(mappings[k[i]]);
		}
	}
	
	obj.fullPageUpdate = function() {
		performFullPageUpdate();
	};
	
	obj.loadTranslations = function(o) {
		obj.translator = i18n.create(o);
	};
	
	window.WFC_mapper = obj;
})(window);

/* language selection and dictionary request/swapping */
(function(langpath, idstr, window, undefined){
	var locales = {
		"en" : "English", 
		"fr" : "Français",
		"it" : "Italiano",
		//"de" : "Deutsch",
		//"sp" : "Español",
		//"pt" : "Português",
		//"ru" : "Pусский",
		//"pl" : "Polski",
		//"uk" : "Українська",
		//"tr" : "Türkçe",
		//"jp" : "日本語",
		"zh-CN" : "中文",
		//"ko" : "한국어"
	};
	var localeRegex = /^[a-z][a-z](?:-[a-z][a-z])?$/i;
	
	var langData = {};
	var lastTried = "";
	
	function updatePage() {
		//console.log(window.WFC_mapper.translator("toxin"));
		//window.document.getElementById("testdiv").innerHTML = JSON.stringify(langData, null, "\t");
		window.WFC_mapper.fullPageUpdate();
	};
	
	function updateLang(o) {
		window.WFC_mapper.translator = i18n.create(o);
	}
	
	function applyLangFailed(how) {
		window.document.getElementById("testdiv").innerHTML = "Request "+how+".";
	}
	
	function applyLang() {
		try {
			langData = JSON.parse(this.response);
			if (!!window.localStorage) {
				window.localStorage.setItem("langCache", JSON.stringify(langData));
			}
			window.WFC_mapper.loadTranslations(langData);
			updatePage();
		} catch (e) {
			console.log("Lang request '" + lastTried + "' unsuccessful.");
		}
	}	
	
	function changeLang(code) {
		if (localeRegex.test(code)) {
			var request = new XMLHttpRequest();
			request.open("GET", langpath + code + ".json");
			request.responseType = "text";
			request.onload = applyLang;
			lastTried = code;
			request.send();
		}		
		
		return;
	}
	
	function changeLangEvent(e) {
		if (langData.code !== e.target.value) {
			return changeLang(e.target.value);
		}
		return;
	}
	
	function initGetStorage() {
		var langCacheString = "";
		if (!!window.localStorage && (langCacheString = window.localStorage.getItem("langCache")) !== null) {
			langData = JSON.parse(langCacheString);
			window.WFC_mapper.loadTranslations(langData);
			updatePage();
		} else {
			changeLang(Object.keys(locales)[0]);
		}
	}
	
	function initRegisterTrigger() {
		var ls = window.document.getElementById(idstr);
		
		var k = Object.keys(locales);
		for (let i = 0; i < k.length; i++) {
			let e = window.document.createElement("option");
			e.text = locales[k[i]];
			e.value = k[i];
			ls.add(e);
		}
		ls.onchange = changeLangEvent;		
	}
	
	function init() {
		initRegisterTrigger();
		initGetStorage();
		
		if (langData.code && langData.code !== window.document.getElementById(idstr).value) {
			window.document.querySelector('#'+idstr+ ' [value="'+langData.code+'"]').selected = true;
		}
	}
	
	window.addEventListener("load", init);
})("project/data/lang/", "lang_select", window);
