// Connect URL
var url = "https://goinstant.net/goinstant-services/docs";
var roomName = 'chat';//prompt("Which Room?");
//var url = prompt("GoInstant App URL?");

var platform = new goinstant.Platform(url);

// Connect to GoInstant
platform.connect(function(err) {
  if (err) {
    return console.error('Error connecting to platform:', err);
  }

  var str = "";
  function js_traverse(o) {
    var type = typeof o; 
    if (type == "object") {
      for (var key in o) {
      str += '<li id="' + key + '"><a class="key">/' + key + '</a><ul>';
        js_traverse(o[key]);
        str += "</ul></li>";
      }
    } else {
      str += '<li id="' + o + '" class="value"><a>' + o + '</a></li>';
    }
  }

  var roomObj = platform.room(roomName);
  roomObj.join(function(err) {
    roomObj.key('/').get(function(err, val, context) {
      js_traverse(val);
      $("#godata").append('<ul>' + str + '</ul>');
      $('#godata').jstree({
        "plugins": [
          "themes",
          "html_data",
          "ui",
          "crrm",
          "hotkeys",
          "types",
          "contextmenu"
        ],
        "themes": {
          "theme": "apple",
          "dots": true,
          "icons": true
        }
      }).bind("select_node.jstree", function (e, data) {
        console.log("STUFF:",e,data);
        console.log("ID:",data.rslt.obj.attr("id"));
      });
    });
    roomObj.key('/messages').get(function(err,val, context) {
      Object.keys(val).forEach(function(key) {
        console.log(key, val[key].text);
      });
      roomObj.key('/messages/1384795411415_628759779').remove(function(err) {
        if (err) {
          throw err;
        }
      });
    });
  });
});

