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

        var sortedKeys = Object.keys(result).sort();

        var i;
        for (i = 0; i < sortedKeys.length; i++) {
          if (result[sortedKeys[i]] == "1") {
            document.getElementById("statustext_" + sortedKeys[i]).innerHTML = "<strong><font color=\"green\">AN</font></strong>"
            document.getElementById("togglebutton_" + sortedKeys[i]).value = "ausschalten"
          } else {
            document.getElementById("statustext_" + sortedKeys[i]).innerHTML = "<strong><font color=\"red\">AUS</font></strong>";
            document.getElementById("togglebutton_" + sortedKeys[i]).value = "einschalten"
          }
        }
      
      }
    });
}

function getinfo() {
    var request = $.ajax({
      url: "/info",
      success: function( result ) {
        console.log(result);

        var sortedKeys = Object.keys(result).sort();

        var i;
        for (i = 0; i < sortedKeys.length; i++) {
            document.getElementById("name_" + sortedKeys[i]).innerHTML = result[sortedKeys[i]].name;
        }
      
      }
    });
}

function getinfo() {
    var request = $.ajax({
      url: "/info",
      success: function( result ) {
        console.log(result);

        var sortedKeys = Object.keys(result).sort();

        var i;
        for (i = 0; i < sortedKeys.length; i++) {
            document.getElementById("name_" + sortedKeys[i]).innerHTML = result[sortedKeys[i]].name;
        }
      
      }
    });
}
