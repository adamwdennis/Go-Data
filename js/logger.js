function startLogger() {
  if (!document.getElementById('enableconsole').checked) {
    return;
  }

  window.giRootKey = window.roomObj.key('/');
  window.giRootKey.watch(loggit, function(err) {
    if (err) {
      console.log('ERROR WATCHING ROOT', err);
    }
  });
}

function stopLogger() {
  if (!window.giRootKey) {
    return;
  }
  window.giRootKey.unwatch();
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
  val = checkIfObj(val);

  var logText = '<span class="loglabel">User:</span> <span class="logdata loguser">'+ context.userId +'</span>'+
    ' <span class="loglabel">Key:</span> <span class="logdata logkey">"'+ context.key+'"</span>'+
    ' <span class="loglabel">Command:</span> <span class="logdata logcommand">'+ context.command+ '</span>'+
    ' <span class="loglabel">Value:</span> <span class="logdata logvalue">'+ val+'</span>';

  contextNum++;
  contextArray[contextNum] = context;
  
  var nodeButton = '<span class="rightside"> <span class="contextbutton" onclick="showNode(\''+context.key+'\')">Show Node</span>';
  var contextButton = ' <span class="contextbutton" onclick="showContext('+contextNum+')">Show Context</span></span>';

  return logText + nodeButton + contextButton;
}

function closeContext() {
  var contextBox = document.getElementById('contextbox');
  contextBox.style.display = 'none';
}

function showContext(conNum) {
  var context = contextArray[conNum];
  var contextText = '<div class="closecontext" onclick="closeContext()">[X]</div>';

  for (var k in context) {
    if (k === 'value') {
      context[k] = checkIfObj(context[k]);
    }
    contextText += '<div class="contextrow"><span class="contextlabel">'+k+':</span> '+
      '<span class="contextdata">'+context[k]+'</span></div>';
  }


  var contextBox = document.getElementById('contextbox');
  contextBox.innerHTML = contextText; 
  contextBox.style.display = 'block';

}

if (window.location.search.indexOf('console=true') !== -1) {
  var autoScroll = document.getElementById('enableconsole').checked = true;
}

function enableChanged(e, e2) {
  var consoleEnabled = document.getElementById('enableconsole').checked;

  if (consoleEnabled) {
    startLogger();
  } else {
    stopLogger();
  }
}

function clearLog() {
  closeContext();
  contextArray = [];
  contextNum = -1;

  var loggerBox = document.getElementById('loggerbox');
  loggerBox.innerHTML = ''; 

}

function showNode(key) {
  openNode(findNode(key));
}
