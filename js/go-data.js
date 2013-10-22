// Connect URL
//var url = "https://goinstant.net/adamwdennis/test";//prompt("GoInstant App URL?");
var url = prompt("GoInstant App URL?");

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
      str += '<li><a>KEY:' + key + '</a><ul>';
        js_traverse(o[key]);
        str += "</ul></li>";
      }
    } else {
      str += "<li><a>OBJ:" + o + "</a></li>";
    }
  }

  var roomName = prompt("Which Room?");
  //var roomName = "example";//prompt("Which Room?");
  var roomObj = platform.room(roomName);
  roomObj.join(function(err) {
    roomObj.key('/').get(function(err, val, context) {
      js_traverse(val);
      $("#container").append('<ul>' + str + '</ul>');
      $('#container').jstree({
        "plugins": [
          "themes",
          "html_data",
          "ui",
          "crrm",
          "hotkeys",
          "checkbox",
          "types",
          "contextmenu"
        ],
        "themes": {
          "theme": "apple",
          "dots": true,
          "icons": true
        },
      });
    });
  });
});

