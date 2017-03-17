function on(id) {
      var request = $.ajax({
      url: "/socket/" + id + "/on",
      success: function( result ) {
        console.log(result)
        getstates();
      }
    });
}

function off(id) {
    var request = $.ajax({
      url: "/socket/" + id + "/off",
      success: function( result ) {
        console.log(result)
        getstates();
      }
    });
}

function toggle(id) {
    var request = $.ajax({
      url: "/socket/" + id + "/toggle",
      success: function( result ) {
        console.log(result)
        getstates();
      }
    });
}

function getstates() {
    var request = $.ajax({
      url: "/states",
      success: function( result ) {
        console.log(result);

        var i;
        var text = "";

        for (i = 0; i < 4; i++) {
          if (result.sockets[i].state == "1") {
            $( "#relais.socket" + i ).html( "<strong><font color=\"green\">AN</font></strong>" );
            document.getElementById("togglebutton" + i).value = "AUSSCHALTEN";
          } else {
            $( "#relais.socket" + i ).html( "<strong><font color=\"red\"> AUS</font></strong>" );
            document.getElementById("togglebutton" + i).value = "EINSCHALTEN";

          }
          text += result.sockets[i].state;

        }
        document.getElementById("demo").innerHTML = text;

      }
    });
}
