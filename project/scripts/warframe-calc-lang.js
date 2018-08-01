/* dictionary -> interface */
;(function(window, undefined) {
	var lang_aliases = {};
	
	var obj = {};
	
	obj.translator = null;	
	
	function performFullPageUpdate() {
		var k = Object.keys(mappings);
		for (let i = 0; i < k.length; i++) {
			window.document.getElementById(k[i]).innerHTML = obj.translator(mappings[k[i]]);
		}
	}
	
	obj.fullPageUpdate = function() {
		//performFullPageUpdate();
	};
	
	obj.loadTranslations = function(o) {
		obj.translator = i18n.create(o);
	};
	
	obj.translate = function(k, a = null) {
		if (a && lang_aliases[a] && lang_aliases[a][k]) return obj.translator(lang_aliases[a][k]);
		return obj.translator(k);
	};

	obj.loadTranslations();
	window.WFC_mapper = obj;
})(window);

/* language selection and dictionary request/swapping */
(function(langpath, idstr, window, undefined){
	var locales = {
		"en" : "English", 
		"fr" : "Français",
		//"it" : "Italiano",
		//"de" : "Deutsch",
		"sp" : "Español",
		//"pt" : "Português",
		//"ru" : "Pусский",
		//"pl" : "Polski",
		//"uk" : "Українська",
		//"tr" : "Türkçe",
		//"jp" : "日本語",
		//"zh-CN" : "中文",
		//"ko" : "한국어"
	};
	var localeRegex = /^[a-z][a-z](?:-[a-z][a-z])?$/i;
	
	window.WFC_mapper.langData = {};
	var lastTried = "";
	
	function updatePage() {
		//console.log(window.WFC_mapper.translator("toxin"));
		//window.document.getElementById("testdiv").innerHTML = JSON.stringify(window.WFC_mapper.langData, null, "\t");
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
			window.WFC_mapper.langData = JSON.parse(this.response);
			if (!!window.localStorage) {
				window.localStorage.setItem("langCache", JSON.stringify(window.WFC_mapper.langData));
			}
			window.WFC_mapper.loadTranslations(window.WFC_mapper.langData);
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
		if (window.WFC_mapper.langData.code !== e.target.value) {
			return changeLang(e.target.value);
		}
		return;
	}
	
	function initGetStorage() {
		var langCacheString = "";
		if (!!window.localStorage && (langCacheString = window.localStorage.getItem("langCache")) !== null) {
			window.WFC_mapper.langData = JSON.parse(langCacheString);
			window.WFC_mapper.loadTranslations(window.WFC_mapper.langData);
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
		
		if (window.WFC_mapper.langData.code && window.WFC_mapper.langData.code !== window.document.getElementById(idstr).value) {
			window.document.querySelector('#'+idstr+ ' [value="'+window.WFC_mapper.langData.code+'"]').selected = true;
		}
	}
	
	window.addEventListener("load", init);
})("project/data/lang/", "lang_select", window);
