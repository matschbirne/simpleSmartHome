 	//Todo: Typen ändern in type und id statt nur id? z.B. type="steckdose" id="01". Dann Gruppen überflüssig?

 	var testData = {
		binarySwitch:[
		{id: "steckdose01", label: "Steckdose 1", isOn: true},
		{id: "steckdose02", label: "Steckdose 2", isOn: false},
		{id: "steckdose03", label: "Steckdose 3", isOn: true}],

		futureTest:[
		{id: "num01", label: "Nummerfeld 1", value: 5},
		{id: "num02", label: "Nummerfeld 2", value: 1},
		{id: "num03", label: "Nummerfeld 3", value: 4}]
	};

	var testData2 =[
		{type: "steckdose", id: "01", label: "Steckdose 1", isOn: true},
		{type: "steckdose", id: "02", label: "Steckdose 2", isOn: false},
		{type: "steckdose", id: "03", label: "Steckdose 3", isOn: true},
		{type: "num", id: "01", label: "Nummerfeld 1", value: 5},
		{type: "num", id: "02", label: "Nummerfeld 2", value: 1},
		{type: "num", id: "03", label: "Nummerfeld 3", value: 4}];

	//Das ist der Zustände (beim Client) aller Elemente 
	var localStates = {};

	$( document ).ready(function(){
		getDataAndBuild();

	});

//Turns Switches on
    function on(id) {
     	 //TODO: Parameter entfernen? mit $(this) arbeiten?
    	changeSwitch(id, true);
}
    
//Turns switches off
     function off(id) {
     	 //TODO: Parameter entfernen? mit $(this) arbeiten?
     	 changeSwitch(id, false);
    }

    function changeSwitch(elementID, on){
    	//TODO: verallgemeinern? Für mehrere Objekte gleichzeitig? Oder Paradigma, dass immer nur eins bedient wird? Wenigstens verallgemeiern, dass auch für andere Arten von Elementen benutzbar?
    	var changedElement = JSON.stringify({
    		type:"steckdose",
    		id: elementID,
    		isOn: on
    	});


    	fakeAjax({
           url: "/state",
           method: "POST", 
           body: changedElement,
           success: function( result ) {
           //TODO
           //Eventuell: JSON parsen oder auto detection? Änderung in localStates speichern
           $("#steckdose"+result.id+" .switchLabel").text((result.isOn)?"On":"Off");

           }
         });
    }

//ToDO: Erinnerung Idee: regelmäßig nur Hash senden. Wenn eine 200 (==gleicher Hash auf Server) zurück kommt, tue nichts. Falls z.B. 201 zurück kommt, rufe einmal getData And Build auf.
    function getDataAndBuild(){
    	fakeAjax({
    		url: "/state",
    		method: "GET",
    		success: function( result ){
    			localStates = result;
    			updateHash();
    			buildPagefromData();
    		}
    	})
    }

    function buildPagefromData(){
	var element, newEl;
	//Verbessern. Weniger Code? Code auslagern?
		// for(var index in localStates.binarySwitch){
		// 	var element = localStates.binarySwitch[index]
		// 	newEl="<div id='"+element.id+"' class='switchElement'>"
		// 			+"<h3>"+element.label+"</h3>"
		// 			+"<span class='switchLabel' >"+((element.isOn)?"On":"Off")+"</span>"
		// 			+"<input onclick='on(\""+element.id+"\")' type='button' value='on'/><input onclick='off(\""+element.id+"\")'  type='button' value='off'/>"
		// 			+"</div>";
		// 	$("#switches").append(newEl);
		// };


		// for(var index in localStates.futureTest){
		// 	var element = localStates.futureTest[index]
		// 	newEl="<div id='"+element.id+"' class='futureElement'>"
		// 			+"<h3>"+element.label+"</h3>"
		// 			+"<div class='switch' >"+element.value+"</div></div>";
		// 	$("#futureTest").append(newEl);
		// }

		// for(var i=1; i<7; i++){
			
		// 	newEl="<div id='"+element.id+"' class='fakeElement'>"
		// 			+"<h3>Troll "+i+"</h3>"
		// 			+"Hahahah, verarscht.....";
		// 	$("#fakeElements").append(newEl);
		// }

		for(var index in localStates){
			var element = localStates[index];
			switch(element.type){
				case "steckdose": addSteckdose(element); break;
				case "num": addFutureTest(element); break;
				default: break;
			}
			// if(element.type=="steckdose"){
			// 	newEl="<div id='steckdose"+element.id+"' class='switchElement'>"
			// 	+"<h3>"+element.label+"</h3>"
			// 	+"<span class='switchLabel' >"+((element.isOn)?"On":"Off")+"</span>"
			// 	+"<input onclick='on(\"steckdose"+element.id+"\")' type='button' value='on'/><input onclick='off(\"steckdose"+element.id+"\")'  type='button' value='off'/>"
			// 	+"</div>";
			// 	alert(newEl);
			// 	$("#switches").append(newEl);
			// }
			// else if(element.type=="num"){

			// 	newEl="<div id='num"+element.id+"' class='futureElement'>"
			// 	+"<h3>"+element.label+"</h3>"
			// 	+"<div class='switch' >"+element.value+"</div></div>";
			// 	$("#futureTest").append(newEl);
			// }
		}

		for(var i=1; i<7; i++){
			
			newEl="<div id='"+element.id+"' class='element fakeElement'>"
			+"<h3>Troll "+i+"</h3>"
			+"Hahahah, verarscht.....";
			$("#fakeElements").append(newEl);
		}

		$("#switches, #fakeElements, #futureTest").show();
		$("#loading").hide();
	}

    function fakeAjax(options){
    	if(options.method=="GET" && options.url=="/state"){
    		setTimeout(function(){
    			options.success(testData2);
    		}, 1000);
    	}

    	if(options.method=="POST" && options.url=="/state"){
    		setTimeout(function(){
    	var element = JSON.parse(options.body);
    	var url = options.method + " " + options.url;
    	options.success(element);
    	}, 100)
    }

    }

function addSteckdose(element){
var newEl="<div id='steckdose"+element.id+"' class='element switchElement'>"
				+"<h3>"+element.label+"</h3>"
				+"<span class='switchLabel' >"+((element.isOn)?"On":"Off")+"</span>"
				+"<input onclick='on(\""+element.id+"\")' type='button' value='on'/><input onclick='off(\""+element.id+"\")'  type='button' value='off'/>"
				+"</div>";
				//alert(newEl);
				$("#switches").append(newEl);
}

function addFutureTest(element){

				var newEl="<div id='num"+element.id+"' class='element futureElement'>"
				+"<h3>"+element.label+"</h3>"
				+"<div class='switch' >"+element.value+"</div></div>";
				$("#futureTest").append(newEl);
}

    function updateHash(){
    	//TODO: Hash berechnen.
    }

