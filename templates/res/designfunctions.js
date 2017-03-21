$( document ).ready(function(){
	//alert("läuft");
	$("#footerTrigger").click(function(){
		//alert("click");
		$("#footerContent").toggleClass("present absent");
		/*switch($("#footerContent").attr("class")){
			case "present": $("footer").css("background","darkorange"); break;
			case "absent": $("footer").css("background","none"); break;
		};*/

	})
})