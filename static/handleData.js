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
			var foo = $(this).attr("id");
			if(foo in footerFunctions)
				footerFunctions[$(this).attr("id")]();
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
	$.ajax({
	        url: "/states",
	        method: "GET",
			timeout: 1000,
	        success: function(result) {
				for(var id in result){
					setSocket(id, result[id]);
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

	function setSocket(name, state){
		var newState = (state == 1)?"on":((state==0)?"off":"")
		var notState = (state == 1)?"off":((state==0)?"on":"")
		$("#"+name).addClass(newState);
		$("#"+name).removeClass(notState);
		$("#"+name+" ."+newState+"Label").show();
		$("#"+name+" "+"."+notState+"Label").hide();
		$("#"+name+"  div input").show();
	}
	//Turns Socket on
	function on(id) {  changeSocket(id, true);  }

	//Turns sockets off
	function off(id) {  changeSocket(id, false);  }

	function toggle(id) {  changeSocket(id, $("#socket" + id).hasClass("off")); }
	
	function changeSocket(id, on) {
		
	    $.ajax({
	        url: "/socket/socket" + id + "/" + ((on) ? "on" : "off"),
	        method: "GET",
			timeout: 500,
	        success: function(result) {
	            if (result.is_success) {
					setSocket("socket"+id, result.state);
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
