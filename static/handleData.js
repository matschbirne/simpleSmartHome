//TODO: fixen: Doublechecking der footerFunctions funzt nicht mehr.

	var activeFunction = "";
	var footerFunctions = {
	    reload: function(){
	        console.log("Ich lade nach...");
	    },
	    allOff: function(){
	        console.log("alle gehen schlafen...");
	    }
	};

	$(document).ready(function() {
	    getDataAndBuild();
	    $("footer li div").click(function(){
	        activateOrExecute($(this).attr("id"));
	    })
	    $("#footerTrigger").click(function() {
	        $("#footerContent").toggleClass("present absent");
	        $("footer li div").removeClass("highlight");
	        activeFunction = "";
	    });
	    $("main").click(function(){
	              $("#footerContent").removeClass("present");
	                    $("#footerContent").addClass("absent");
	                    activeFunction = "";
	    })
		
		setInterval(function(){ 
    //$("#sockets div").removeClass("on off"); 
	$.ajax({
	        url: "/states",
	        method: "GET",
			timeout: 1000,
	        success: function(result) {
				for(var id in result){
					//alert("id:"+ id+ ", "+result[id] );
					//alert("#"+id);
					var state = (result[id] == 1)?"on":((result[id]==0)?"off":"")
					var notState = (result[id] == 1)?"off":((result[id]==0)?"on":"")
					$("#"+id).addClass(state);
					$("#"+id+" "+"."+state+"Label").show;
					$("#"+id+" "+" div input").show();
	        }
			},
			error: function(){
				$("#sockets div").removeClass("on off")
				$("#sockets div h1").hide();
				$("#sockets div div input").hide();
			}
	    });
}, 2000);

	});

	//Turns Socket on
	function on(id) {  changeSocket(id, true);  }

	//Turns sockets off
	function off(id) {  changeSocket(id, false);  }

	function toggle(id) {  changeSocket(id, $("#socket" + id).hasClass("off")); }

	function states(){
	 $.ajax({
	        url: "/states",
	        method: "GET",
	        success: function(result) {
				for(var id in result){
					alert("id:"+ id+ ", "+result[id] ); 
	        }
			}
	    });
	}
	
	function changeSocket(id, on) {
		
	    $.ajax({
	        url: "/socket/socket" + id + "/" + ((on) ? "on" : "off"),
	        method: "GET",
			timeout: 500,
	        success: function(result) {
				//alert("KLSHDFSLDLD");
	            //TODO Eventuell: JSON parsen oder auto detection?
	            //alert("is_success:"+result.is_success+", id: "+result.id+", state:"+result.state);
	            if (result.is_success) {
					//alert(result.state)
	                var newState = (result.state) ? "on" : "off";
	                var notNewState = (result.state) ? "off" : "on";
					//alert(newState);
					//alert("#socket" + result.addr)
					$("#socket" + id).removeClass("on off");
	                $("#socket" + id).addClass(newState);
					$("#socket" + id+" ."+newState+"Label").show();

	            }
				if(result.id != "socket"+id) { alert("id ist falsch"); }
				if(!result.is_success) {alert("Status ist unklar");}
	        },
			error: function(){
				$("#socket" + id).removeClass("on").removeClass("off");
				$("#socket" + id+" h1").hide();
				$("#socket" + id+" div input").hide();
			}
	    });
	}



	/*ToDO: Erinnerung Idee: regelmäßig nur Hash senden. Wenn eine 200 (==gleicher Hash auf Server) zurück kommt, tue nichts. Falls z.B. 201 zurück kommt, 
rufe einmal getData And Build auf. Wie hash bilden? Ich speichere die Zustände im Moment nicht in einem Array, sondern setze Änderung stets im FrontEnd 
um. Wann muss der Hash immer berechnet werden? Eine Funktion vor dem Ajaxaufruf aufrufen, Optionenobjekt nur durchreichen? Bzw. success-Funktion 
überschreiben und dort Hash vorschalten? */
	function getDataAndBuild() {
	    jQuery.ajax({
	        url: "/info",
	        method: "GET",
	        success: function(result) {
	            buildPagefromData(result);
	        }
	    })
	}
	//In Case of New (type) ICON: neuen Case hinzufügen  
	function buildPagefromData(localStates) {
	    var element, newEl;
	    for (var index in localStates) {
	        var element = localStates[index];
	        if(element.type != "socket") {alert("HA")}
			else{
			//alert(element.state); 
	         var newEl = "<div id='" + element.type + element.addr + "' class='element " + element.type + "Element " +
	        (element.state?"on":"off")+ "'>\n";

	    newEl += "<h1 class='onLabel'>On</h1><h1 class='offLabel'>Off</h1>";
	    newEl += "\t<h3>" + element.name + "</h3>\n";
	    newEl += "\t<div class='" + element.type + "Controls'>\n\t" + "<input onclick='toggle("+element.addr+")'  type='button' value='toggle'/>" +
	                    "<input onclick='off("+element.addr+")'  type='button' value='off'/>" +
	                    "<input onclick='on("+element.addr+")' type='button' value='on'/>" + "</div>\n";
	    newEl += "</div>";
	    // console.log(newEl);
	    $("#" + element.type + "s").append(newEl);
			}
	    }


	    //In Case of New (type) ICON: Trennlinie, anzeigen.
	    $("main > div").append("<hr noshade>").show();
	    $("#loading").hide();
		
	}

	/*
	@param:   type: socket, 
	            element:{
	                id
	                type
	                label
	            opt     contentBefore (HTML)
	            opt     isOn (Text "on" oder "off")
	            opt     contentParsed
	            opt     controlsParsed
	                            
	            }
	*/

	function optional(str) {
	    return (str ? str : "");
	}

/*
	function parseElement(element, parsed) {
	    var str = "",
	        temp;

	    if (parsed && typeof parsed == "string") {
	        str = "";
	        var varCount = (parsed.split("@").length - 1) / 2;
	        for (var i = 1; i <= varCount; i++) {
	            temp = parsed.split("@" + i + ">");
	            str += temp[0];
	            parsed = temp[1];
	            temp = parsed.split("<" + i + "@");
	            str += element[temp[0]];
	            parsed = temp[1];

	        }
	        str += parsed;
	    }

	    return str;

	}
*/
	function activateOrExecute(which){
	    //alert(which);
	    if (which == activeFunction) execute(which);
	    else {activate(which);}

	    $("footer li div").removeClass("highlight");
	    if(activeFunction) $("#"+activeFunction).addClass("highlight");

	    // if(which in footerFunctions){
	    // 	footerFunctions[which]();
	    // }
	    // else{
	    // 	console.log("No Function Found");
	    // }
	}

	function execute(which){
		if(which in footerFunctions) footerFunctions[which]();
		activeFunction = "";
	}

	function activate(which){
		activeFunction = which;
	}