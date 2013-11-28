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

  function convertJSONToLists(o, str) {
    str = str || '';
    var type = typeof o; 
    if (type == "object") {
      for (var key in o) {
        str += '<li class="key" id="' + key + '">';
        str += '<a class="key">/' + key + '</a>';
        str += '<ul>';
        str = convertJSONToLists(o[key], str);
        str += "</ul>";
        str += "</li>";
      }

    } else {
      str += '<li id="' + o + '" class="value"><a>' + o + '</a></li>';
    }

    return str;
  }

  var roomObj = platform.room(roomName);
  roomObj.join(function(err) {
    roomObj.key('/').get(function(err, val, context) {
      var str = convertJSONToLists(val);

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
        var keyName = getKeyName(data);


        console.log(keyName);

      }).bind('rename_node.jstree', function(e) {

      }).bind('delete_node.jstree', function(e) {

      }).bind('create_node.jstree', function(e) {

      });

      /*
      create_node.jstree
      delete_node.jstree
      rename_node.jstree

      open_node.jstree
      move_node.jstree
      clean_node.jstree
      refresh.jstree
      */
    });
  });
});

function getKeyName(data) {
  var name = "";
  var node = $(data.rslt.obj);
  do {
    if (node.prop('tagName') == 'LI' && node.hasClass('key')) {
      name = '/' + node.attr('id') + name;
    }

    node = node.parent();

  } while(!node.hasClass('jstree'));

  return name;
}
