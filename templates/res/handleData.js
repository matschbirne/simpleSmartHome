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
		{type: "steckdose", id: "01", label: "Bad Spiegel", isOn: true},
		{type: "steckdose", id: "02", label: "Bad Boden", isOn: false},
		{type: "steckdose", id: "03", label: "Wohnzimmer Couch", isOn: true},
                {type: "steckdose", id: "04", label: "Wohnzimmer Tür", isOn: false},
        {type: "steckdose", id: "05", label: "Schlafzimmer Bett", isOn: false},
        {type: "steckdose", id: "06", label: "Schlafzimmer Fenster", isOn: true},
                {type: "steckdose", id: "07", label: "Schlafzimmer Heizung", isOn: false},
        {type: "steckdose", id: "08", label: "Küche", isOn: true},
        {type: "steckdose", id: "09", label: "Balkon", isOn: true},
		{type: "num", id: "01", label: "Nummerfeld 1", value: 5},
		{type: "num", id: "02", label: "Nummerfeld 2", value: 1},
		{type: "num", id: "03", label: "Nummerfeld 3", value: 4}];

	//Das ist der Zustände (beim Client) aller Elemente 
	//var localStates = {};

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
        //alert("off "+id);
     	 //TODO: Parameter entfernen? mit $(this) arbeiten?
     	 changeSwitch(id, false);
    }

    function changeSwitch(id, on){
    	//TODO: verallgemeinern? Für mehrere Objekte gleichzeitig? Oder Paradigma, dass immer nur eins bedient wird? Wenigstens verallgemeiern, dass auch für andere Arten von Elementen benutzbar?



    	fakeAjax({
           url: "/socket/"+id+"/"+((on)?"on":"off"),
           method: "GET", 
           success: function( result ) {
           //TODO
           //Eventuell: JSON parsen oder auto detection? Änderung in localStates speichern
           if(result.type=="socket"){
            var newState = (result.isOn)?"on":"off";
            var notNewState = (result.isOn)?"off":"on";
            $("#steckdose"+result.id).addClass(newState).removeClass(notNewState);

           //$("#steckdose"+result.id+" .switchLabel").text();

       }
   }
});}

        function toggle(id){
        changeSwitch(id, $("#steckdose"+id).hasClass("off"));
        }


//ToDO: Erinnerung Idee: regelmäßig nur Hash senden. Wenn eine 200 (==gleicher Hash auf Server) zurück kommt, tue nichts. Falls z.B. 201 zurück kommt, rufe einmal getData And Build auf.
    function getDataAndBuild(){
    	fakeAjax({
    		url: "/states",
    		method: "GET",
    		success: function( result ){
    			//localStates = result;
    			//updateHash();
    			buildPagefromData(result);
    		}
    	})
    }
    //In Case of New (type) ICON: neuen Case hinzufügen  
    function buildPagefromData(localStates){
	var element, newEl;
		for(var index in localStates){
			var element = localStates[index];
			switch(element.type){
				case "steckdose": addSteckdose(element); break;
				case "num": addFutureTest(element); break;
				default: break;
			}
		}




			
			$("#fakeElements").append("<div id='rightPanel' class='element panel'>"
			+"<h3>Informationen </h3>"
			+"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata </div>");
		
        //In Case of New (type) ICON: Trennlinie, anzeigen.
		$("#switches, #futureTest").append("<hr noshade>");
		$("#switches, #fakeElements, #futureTest").show();
		$("#loading").hide();
	}

    function fakeAjax(options){
    	if(options.method=="GET" && options.url=="/states"){
    		setTimeout(function(){
    			options.success(testData2);
    		}, 100);
    	}

    	if(options.method=="GET" && options.url.includes("/socket")){
    		setTimeout(function(){
               // alert("hi");
                var opt = options.url.split("/");
                //alert(options.url.split("/").toString());
                var test = "";
                for(var i in opt){
                    test += i+". "+opt[i]+"\n";
                }
                //alert(test);
                var ide = opt[2];
                var istan = ((opt[3]=="on")?true:false);
                var res = {
                    type:"socket", 
                    id:ide, 
                    isOn: istan 
                };
                    //alert(res.toString());

               options.success(res);
    	//var element = JSON.parse(options.body);
    	//var url = options.method + " " + options.url;
    	//options.success(element);
    	}, 100)
    }

    }


//TODO: Verallgemeinern: statt je eine Funktion für jeden Typen soll eine Funktion mit Steuerung durch Parameter
function addSteckdose(element){
var newEl="<div id='steckdose"+element.id+"' class='element switchElement "+((element.isOn)?"on":"off")+"'>"
				+"<h3>"+element.label+"</h3>"
                +"<h1 class='onLabel'>On</h1><h1 class='offLabel'>Off</h1>"
				+"<div class='switchButtons'><input onclick='toggle(\""+element.id+"\")'  type='button' value='toggle'/><input onclick='off(\""+element.id+"\")'  type='button' value='off'/><input onclick='on(\""+element.id+"\")' type='button' value='on'/></div></div>";
				//alert(newEl);
				$("#switches").append(newEl);
}

function addFutureTest(element){

				var newEl="<div id='num"+element.id+"' class='element futureElement'>"
				+"<h3>"+element.label+"</h3>"
				+"<div class='switch' >"+element.value+"</div></div>";
				$("#futureTest").append(newEl);
}

//In Case of New (type) ICON: Element parsen

 //   function updateHash(){
    	//TODO: Hash berechnen. Wo einfügen?
 //   }

