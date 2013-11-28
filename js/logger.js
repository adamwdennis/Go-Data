function startLogger() {
  console.log('STart LOGGER called');
  if (!document.getElementById('enableconsole').checked) {
    return;
  }

  var rootKey = window.giRoom.key('/');
  rootKey.watch(loggit, function(err) {
    if (err) {
      console.log('ERROR WATCHING ROOT', err);
    }
  });
}

function stopLogger() {
  console.log('STOP LOGGER');
  window.giRoom.key('/').unwatch();
}

function loggit(val, context) {
  
  var logText = createLog(val, context);
  
  var loggerBox = document.getElementById('loggerbox');
  loggerBox.innerHTML = loggerBox.innerHTML + '<p class="logtext clearfix">'+logText+'</p>'; 
  
  //auto scroll
  var autoScroll = document.getElementById('autoscroll').checked;
  if (autoScroll) {
    loggerBox.scrollTop = loggerBox.scrollHeight;
  }
}

function checkIfObj(val) {
  if (typeof val === 'object') {
    val = '<span class="loginfo">Value is object</span>';
  }

  return val;

}

var contextArray = [];
var contextNum = -1;

function createLog(val, context) {
  console.log('context', context);

  val = checkIfObj(val);

  var logText = '<span class="loglabel">User:</span> <span class="logdata loguser">'+ context.userId +'</span>'+
    ' <span class="loglabel">Key:</span> <span class="logdata logkey">"'+ context.key+'"</span>'+
    ' <span class="loglabel">Command:</span> <span class="logdata logcommand">'+ context.command+ '</span>'+
    ' <span class="loglabel">Value:</span> <span class="logdata logvalue">'+ val+'</span>';

  contextNum++;
  contextArray[contextNum] = context;
  var contextButton = ' <span class="contextbutton" onclick="showContext('+contextNum+')">Show Context</span>';

  return logText + contextButton;
}

function showContext(conNum) {
  var context = contextArray[conNum];
  var contextText = '';

  for (var k in context) {
    console.log('K', k);
    if (k === 'value') {
      context[k] = checkIfObj(context[k]);
    }
    contextText += '<div class="contextrow"><span class="contextlabel">'+k+':</span> '+
      '<span class="contextdata">'+context[k]+'</span></div>';
  }


  var contextBox = document.getElementById('contextbox');
  contextBox.innerHTML = contextText; 

}

if (window.location.search.indexOf('console=true') !== -1) {
  console.log('URL ENABLE CONSOLE');

  var autoScroll = document.getElementById('enableconsole').checked = true;
}

function enableChanged(e, e2) {
  console.log('eeeeeee', document.getElementById('enableconsole').checked);
  var consoleEnabled = document.getElementById('enableconsole').checked;

  if (consoleEnabled) {
    startLogger();
  } else {
    stopLogger();
  }
}