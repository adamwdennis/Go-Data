/*jshint browser:true*/
/*global goinstant, $, console */

'use strict';

// Connect URL
var url = "https://goinstant.net/nealstewart/awesome";
var roomName = 'supercool';//prompt("Which Room?");
//var url = prompt("GoInstant App URL?");

var platform = new goinstant.Platform(url);

// Connect to GoInstant
platform.connect(function(err) {
  if (err) {
    return console.error('Error connecting to platform:', err);
  }

  var roomObj = platform.room(roomName);
  window.roomObj = roomObj;

  var tree;

  roomObj.join(function(err) {
    if (err) {
      throw err;
    }

    var rootKey = roomObj.key('/');
    rootKey.get(setupTree);
    rootKey.on('set', { bubble: true, listener: keyUpdated});
    rootKey.on('remove', { bubble:true, listener: keyRemoved });
  });

  function setupTree(err, val) {
    if (err) {
      throw err;
    }

    var str = convertJSONToLists(val);

    $("#godata").append('<ul>' + str + '</ul>');
    tree = $('#godata').jstree({
      "plugins": [
        "themes",
        "html_data",
        "ui",
        "crrm",
        "hotkeys",
        "types",
        "contextmenu"
      ],
      'contextmenu': {
        items: {
          // Some key
          /*
          "set" : {
          // The item label
          "label"       : "Set",
          // The function to execute upon a click
          "action"      : set
          },
          */

          "remove" : {
            // The item label
            "label"       : "Remove",
            // The function to execute upon a click
            "action"      : remove
          },
          //            "rename": null,
          "delete": null,
          "create": null,
          "ccp": null
          /* MORE ENTRIES ... */
        }
      },

      "themes": {
        "theme": "apple",
        "dots": true,
        "icons": true
      }
    });
    tree.jstree('contextmenu', 'items', {});


    tree.bind("select_node.jstree", function(e, data) {
      /////////////////////
      // SELECT
      /////////////////////
      window.location.hash = "#" + getKeyName(data.rslt.obj);
    }).bind('rename_node.jstree', function(e, data) {
      /////////////////////
      // RENAME
      /////////////////////

      var keyName = getKeyName(data.rslt.obj);
      var newValue = data.args[1];
      var isValue = true;
      if (isValue) {
        return roomObj.key(keyName).set(newValue, function(err) {
          if (err) {
            throw err;
          }
          console.log('renamed');
        });
      }

    }).bind('delete_node.jstree', function() {
      /////////////////////
      // DELETE
      /////////////////////

    }).bind('create_node.jstree', function() {
      /////////////////////
      // CREATE
      /////////////////////

    });

    var keyOnLoad = window.location.hash.substring(1);
    if (keyOnLoad) {
      openNode(findNode(keyOnLoad));
    }

    /*
    create_node.jstree
    delete_node.jstree
    rename_node.jstree

    open_node.jstree
    move_node.jstree
    clean_node.jstree
    refresh.jstree
    */
  }

  function keyUpdated(val, context) {
    // find the element
    var node = findNode(context.key);
    
    // update the element
    var leaf = node.find('.value');
    tree.jstree("set_text", leaf, val);

    openNode(node);

    // scroll to the element
    // highlight the element
  }

  function keyRemoved(val, context) {
    var node = findNode(context.key);
    if (!node) {
      return;
    }

    removeAndPrune(node.get(0));
  }

  function removeAndPrune(node) {
    tree.jstree('remove', node);
  }

  function remove(node) {
    var tree = this;

    var keyName = getKeyName(node);

    roomObj.key(keyName).remove(function() {
      if (node.hasClass('key')) {
        tree.remove(node);

      } else {
        tree.remove(node.parent().closest('li'));
      }
    });
  }

  function openNode(node) {
    // expand the tree up to the element
    var currNode = node;

    do {
      tree.jstree('open_node', currNode);

      currNode = currNode.parent().closest('.key');

    } while(currNode.length);
  }

  function findNode(keyName) {
    var keyNames = keyName.split('/').slice(1);

    var selectorKeyNames = keyNames.map(function(key) {
      return 'li[data-key-name=' + key + ']';
    });

    var selector = selectorKeyNames.join(' ');

    var node = tree.find(selector);

    if (node.length) {
      return node.eq(0);
    } else {
      return null;
    }
  }
});

function convertJSONToLists(o, str) {
  str = str || '';
  var type = typeof o;
  if (type == "object") {
    for (var key in o) {
      str += '<li class="key" data-key-name="' + key + '">';
      str += '<a class="key">/' + key + '</a>';
      str += '<ul>';
      str = convertJSONToLists(o[key], str);
      str += "</ul>";
      str += "</li>";
    }

  } else {
    str += '<li class="value"><a>' + o + '</a></li>';
  }

  return str;
}

function getKeyName(node) {
  var name = "";
  node = $(node);
  do {
    if (node.prop('tagName') == 'LI' && node.hasClass('key')) {
      name = '/' + node.data('key-name') + name;
    }

    node = node.parent();

  } while(!node.hasClass('jstree'));

  return name;
}
