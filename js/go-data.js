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
        var keyName = getName(data);
      });
    });
  });
});

function getName(data) {
  var name = "";
  var node = $(data.rslt.obj);
  do {
    if (node.prop('tagName') == 'LI') {
      name = '/' + node.attr('id') + name;
    }
    node = node.parent();
  } while(!node.hasClass('jstree'));
  return name;
}
