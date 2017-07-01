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
	
	var testData2 = [{
	    type: "socket",
	    addr: "0",
	    name: "Wohnzimmer Tür",
	    state: 0
	},{
	    type: "socket",
	    addr: "1",
	    name: "Bad Spiegel",
	    state: 1	
      }, {
	    type: "socket",
	    addr: "2",
	    name: "Bad Boden",
	    state: 0
	}, {
	    type: "socket",
	    addr: "3",
	    name: "Wohnzimmer Couch",
	    state: 1
  },  {
	    type: "num",
	    addr: "1",
	    label: "Nummerfeld 1",
	    value: 5
	}, {
	    type: "num",
	    addr: "2",
	    label: "Nummerfeld 2",
	    value: 1
	}, {
	    type: "test",
	    addr: "1",
	    label: "Hello World",
	    max: 100,
	    value: 10
	}, {
	    type: "test",
	    addr: "2",
	    label: "Hello World",
	    max: 100,
	    value: 25
	}, {
	    type: "test",
	    addr: "03",
	    name: "Hello World",
	    max: 100,
	    value: 40
	}, {
	    type: "test",
	    addr: "01",
	    name: "Hello World",
	    max: 100,
	    value: 55
	}, {
	    type: "test",
	    addr: "02",
	    name: "Hello World",
	    max: 100,
	    value: 70
	}, {
	    type: "test",
	    addr: "03",
	    name: "Hello World",
	    max: 100,
	    value: 95
	}];

	$(document).ready(function() {
	    getDataAndBuild();
	    $("footer li div").click(function(){

	        activateOrExecute($(this).attr("id"));

	       //  $("footer li div").removeClass("highlight");
	       //  if($(this).attr("id")==activeFunction){
	       //      if(activeFunction in footerFunctions){
	       //          //alert("Funktion gefunden");
	       //          footerFunctions[activeFunction]();
	       //      }
	       //      $("#"+activeFunction).removeClass("highlight");
	       //      //alert("blaaaaa");
	       //      activeFunction="";
	            
	       //  }
	       //  else{
	       //      $("#"+activeFunction).removeClass("highlight");
	       //  $("#"+$(this).attr("id")).addClass("highlight");
	       // activeFunction = $(this).attr("id");     
	       //  }
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

	});

	//Turns Socket on
	function on(id) {  changeSocket(id, true);  }

	//Turns sockets off
	function off(id) {  changeSocket(id, false);  }

	function toggle(id) {  changeSocket(id, $("#socket" + id).hasClass("off")); }

	function changeSocket(id, on) {
	    fakeAjax({
	        url: "/socket/socket" + id + "/" + ((on) ? "on" : "off"),
	        method: "GET",
	        success: function(result) {
	            //TODO Eventuell: JSON parsen oder auto detection?
	            console.log(result.url);
	            if (result.type == "socket") {
	                var newState = (result.state) ? "on" : "off";
	                var notNewState = (result.state) ? "off" : "on";
	                $("#socket" + result.addr).addClass(newState).removeClass(notNewState);

	            }
	        }
	    });
	}



	//ToDO: Erinnerung Idee: regelmäßig nur Hash senden. Wenn eine 200 (==gleicher Hash auf Server) zurück kommt, tue nichts. Falls z.B. 201 zurück kommt, rufe einmal getData And Build auf. Wie hash bilden? Ich speichere die Zustände im Moment nicht in einem Array, sondern setze Änderung stets im FrontEnd um. Wann muss der Hash immer berechnet werden? Eine Funktion vor dem Ajaxaufruf aufrufen, Optionenobjekt nur durchreichen? Bzw. success-Funktion überschreiben und dort Hash vorschalten? 
	function getDataAndBuild() {
	    fakeAjax({
	        url: "/states",
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
	        switch (element.type) {
	            case "socket":
	                element.contentBefore = "<h1 class='onLabel'>On</h1><h1 class='offLabel'>Off</h1>";
	                element.controlsParsed = "<input onclick='toggle(\"@1>addr<1@\")'  type='button' value='toggle'/>" +
	                    "<input onclick='off(\"@2>addr<2@\")'  type='button' value='off'/>" +
	                    "<input onclick='on(\"@3>addr<3@\")' type='button' value='on'/>";
	                break;
	            case "num":
	                element.contentParsed = "This is my @1>value<1@. Sparta!";
	                break;
	            case "test":
	                //Macht schöne Balken je nach %-Wert von rot nach grün
	                element.percentage = Math.round(100 * element.value / element.max);
	                var constant = 100;
	                var increasing = ((element.percentage <= 50) ? element.percentage : (100 - element.percentage));
	                if (element.percentage <= 50) {
	                    element.red = 100;
	                    element.green = 2 * element.percentage;
	                }
	                else {
	                    element.green = 100;
	                    element.red = 2 * (100 - element.percentage);
	                }

	                element.contentParsed = "<p style='float: right'>@1>max<1@</p><div style='height: 25px; width: @2>percentage<2@%; background: rgb(@3>red<3@%,@4>green<4@%, 0%); text-align: left'>@5>value<5@</div>";
	                break;
	            default:
	                break;
	        }
	        addElement(element.type, element);
	    }


	    //In Case of New (type) ICON: Trennlinie, anzeigen.
	    $("main > div").append("<hr noshade>").show();
	    $("#loading").hide();
	}

	/*
	@param:   type: socket, num, 
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
	function addElement(type, element) {
	    var newEl = "<div id='" + type + element.addr + "' class='element " + type + "Element " +
	        (element.type == "socket")? (element.state?"off":"on") : "" + "'>\n";

	    newEl += optional(element.contentBefore);
	    newEl += "\t<h3>" + element.name + "</h3>\n";
	    newEl += "\t<div class='" + type + "Content'>\n\t" + parseElement(element, optional(element.contentParsed)) + "</div>\n";
	    newEl += "\t<div class='" + type + "Controls'>\n\t" + parseElement(element, optional(element.controlsParsed)) + "</div>\n";
	    newEl += "</div>";
	    // console.log(newEl);
	    $("#" + type + "s").append(newEl);
	}


	function optional(str) {
	    return (str ? str : "");
	}

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

	/*


	       TODO: alle Aufrufe von fakeAjax durch richtige ersetzen, testen. Regelmäßige Abfrage über Hash. Eventuell eigenen Ajax-Request abstrahieren. Siehe obenn */

	function fakeAjax(options) {
	    if (options.method == "GET" && options.url == "/states") {
	        setTimeout(function() {
	            options.success(testData2);
	        }, 500);
	    }

	    if (options.method == "GET" && options.url.includes("/socket/")) {
	        setTimeout(function() {
	            // alert("hi");
	            var opt = options.url.split("/");
	            //alert(options.url.split("/").toString());
	            var test = "";
	            for (var i in opt) {
	                test += i + ". " + opt[i] + "\n";
	            }
	            //alert(test);
	            var ide = opt[2];
	            var istan = ((opt[3] == "on") ? true : false);
	            var res = {
	                type: "socket",
	                id: ide,
	                isOn: istan
	            };
	            //alert(res.toString());
	            res.url = options.url;
	            options.success(res);
	        }, 300);
	    }
	}
	
	
	