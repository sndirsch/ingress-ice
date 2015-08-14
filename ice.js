/**
* @file Ingress-ICE, the main script
* @author Nikitakun (https://github.com/nibogd)
* @version 3.2.1
* @license MIT
* @see {@link https://github.com/nibogd/ingress-ice|GitHub }
* @see {@link https://ingress.divshot.io/|Website }
*/

"use strict";
//Initialize

var system   = require('system');
var args     = system.args;
var fs       = require('fs');
var cookiespath = '.iced_cookies';


/**
* Check if all arguments are present
* @function
*/
if (!args[11]) {
  console.log("Something went wrong. Please reconfigure ingress-ice (http://github.com/nibogd/ingress-ice for help)");
}
/**
* Parse the config. Command-line parameters or from a file - if using a start script.
* if the first argument is a string, use old config format
* if the first argument is config version, use that version of config
*/
var configver = 0;
var l = '';
var p = '';
var area = '';
var minlevel = 0;
var maxlevel = 0;
var v = 0;
var width = 0;
var height = 0;
var folder = '';
var ssnum = 0;
var iitc = 0;
var timestamp = 0;
var cookieSACSID = '';
var cookieCSRF = '';
var hideRes = 0;
var hideEnl = 0;
var hideField = 0;
var hideLink = 0;

if (isNaN(args[1])) {
  configver    = 0;
  l            = args[1];
  p            = args[2];
  area         = args[3];
  minlevel     = parseInt(args[4], 10);
  maxlevel     = parseInt(args[5], 10);
  v            = 1000 * parseInt(args[6], 10);
  width        = parseInt(args[7], 10);
  height       = parseInt(args[8], 10);
  folder       = args[9];
  ssnum        = parseInt(args[10], 10);
  iitc         = 0;
  timestamp    = 0;
} else if (parseInt(args[1], 10) === 1) {
  configver    = parseInt(args[1], 10);
  l            = args[2];
  p            = args[3];
  area         = args[4];
  minlevel     = parseInt(args[5], 10);
  maxlevel     = parseInt(args[6], 10);
  v            = 1000 * parseInt(args[7], 10);
  width        = parseInt(args[8], 10);
  height       = parseInt(args[9], 10);
  folder       = args[10];
  ssnum        = parseInt(args[11], 10);
  iitc         = parseInt(args[12], 10);
  timestamp    = parseInt(args[13], 10);
  if (args[14]) {
    hideRes = Boolean(parseInt(args[14], 10));
    hideEnl = Boolean(parseInt(args[15], 10));
    hideLink = Boolean(parseInt(args[16], 10));
    hideField = Boolean(parseInt(args[17], 10));
  }
} else if (parseInt(args[1], 10) === 2) {
  configver    = parseInt(args[1], 10);
  cookieSACSID = args[2];
  cookieCSRF   = args[3];
  area         = args[4];
  minlevel     = parseInt(args[5], 10);
  maxlevel     = parseInt(args[6], 10);
  v            = 1000 * parseInt(args[7], 10);
  width        = parseInt(args[8], 10);
  height       = parseInt(args[9], 10);
  folder       = args[10];
  ssnum        = parseInt(args[11], 10);
  iitc         = parseInt(args[12], 10);
  timestamp    = parseInt(args[13], 10);
  if (args[14]) {
    hideRes = Boolean(parseInt(args[14], 10));
    hideEnl = Boolean(parseInt(args[15], 10));
    hideLink = Boolean(parseInt(args[16], 10));
    hideField = Boolean(parseInt(args[17], 10));
  }
}

/*global phantom */
/*global idleReset */

/**
* Counter for number of screenshots
*/
var curnum       = 0;
var version      = '3.2.1';

/**
* Delay between logging in and checking if successful
* @default
*/
var loginTimeout = 10 * 1000;

/**
* twostep auth trigger
*/
var twostep      = 0;
var page         = require('webpage').create();
page.onConsoleMessage = function () {};
page.onError  = function () {};

/** @function setVieportSize */
if (!iitc) {
  page.viewportSize = {
    width: width + 42,
    height: height + 167
  };
} else {
  page.viewportSize = {
    width: width,
    height: height
  };
}
//Functions

/**
* console.log() wrapper
* @param {String} str - what to announce
*/
function announce(str) {
  console.log(getDateTime(0) + ': ' + str);
}

/**
* Returns Date and time
* @param {number} format - the format of output, 0 for DD.MM.YYY HH:MM:SS, 1 for YYYY-MM-DD--HH-MM-SS (for filenames)
* @returns {String} date
*/
function getDateTime(format) {
  var now     = new Date();
  var year    = now.getFullYear();
  var month   = now.getMonth()+1;
  var day     = now.getDate();
  var hour    = now.getHours();
  var minute  = now.getMinutes();
  var second  = now.getSeconds();
  if(month.toString().length === 1) {
    month = '0' + month;
  }
  if(day.toString().length === 1) {
    day = '0' + day;
  }
  if(hour.toString().length === 1) {
    hour = '0' + hour;
  }
  if(minute.toString().length === 1) {
    minute = '0' + minute;
  }
  if(second.toString().length === 1) {
    second = '0' + second;
  }
  var dateTime;
  if (format === 1) {
    dateTime = year + '-' + month + '-' + day + '--' + hour + '-' + minute + '-' + second;
  } else {
    dateTime = day + '.' + month + '.' + year + ' '+hour+':'+minute+':'+second;
  }
  return dateTime;
}

/**
* Sets minimal and maximal portal levels (filter) by clicking those buttons on filter panel.
* 10 000 ms will be enough
* @summary Portal level filter
* @param {number} min - minimal portal level
* @param {number} max - maximum portal level
*/
function setMinMax(min, max) {
  var minAvailable = page.evaluate(function () {
    return document.querySelectorAll('.level_notch.selected')[0];
  });
  if (parseInt(minAvailable.id[9], 10) > min) {
    announce('The minimal portal level is too low for current zoom, using default.');
  } else {
    var rect = page.evaluate(function() {
      return document.querySelectorAll('.level_notch.selected')[0].getBoundingClientRect();
    });
    page.sendEvent('click', rect.left + rect.width / 2, rect.top + rect.height / 2);
    window.setTimeout(function() {
      var rect1 = page.evaluate(function(min) {
	return document.querySelector('#level_low' + min).getBoundingClientRect();
      }, min);
      page.sendEvent('click', rect1.left + rect1.width / 2, rect1.top + rect1.height / 2);
      if (max === 8) {
	page.evaluate(function () {
	  document.querySelector('#filters_container').style.display = 'none';
	});
      }
    }, 2000);
  }
  if (max < 8) {
    window.setTimeout(function() {
      var rect2 = page.evaluate(function() {
	return document.querySelectorAll('.level_notch.selected')[1].getBoundingClientRect();
      });
      page.sendEvent('click', rect2.left + rect2.width / 2, rect2.top + rect2.height / 2);
      window.setTimeout(function() {
	var rect3 = page.evaluate(function(min) {
	  return document.querySelector('#level_high' + min).getBoundingClientRect();
	}, max);
	page.sendEvent('click', rect3.left + rect3.width / 2, rect3.top + rect3.height / 2);
	page.evaluate(function () {
	  document.querySelector('#filters_container').style.display = 'none';
	});
      }, 2000);
    }, 4000);
  }
}

/**
* Screenshot wrapper
*/
function s() {
  announce('Screen saved');
  page.render(folder + 'ice-' + getDateTime(1) + '.png');
}

/**
* Quit if an error occured
* @param {String} err - the error text
*/
function quit(err) {
  if (err) {
    announce('ICE crashed. Reason: ' + err + ' :(');
  } else {
    announce('Quit');
  }
  phantom.exit();
}

/**
* Check if portal level settings are correct and quit if not
* @param {number} minlevel - minimal portal level
* @param {number} maxlevel - maximal portal level
*/
function checkSettings(minlevel, maxlevel) {
  if ((minlevel < 0 || minlevel > 8) || (maxlevel < 0 || maxlevel > 8) || (!minlevel || !maxlevel)) {
    quit('the lowest and/or highest portal levels were set wrong. There are no 9 level portals.');
  }
  if (minlevel>maxlevel) {
    quit('lowest portal level is higher than highest. Isn\'t that impossible?!');
  }
}

/**
* Greeter. Beautiful ASCII-Art logo.
*/
function greet() {
  console.log('\n     _____ )   ___      _____) \n    (, /  (__/_____)  /        \n      /     /         )__      \n  ___/__   /        /          \n(__ /     (______) (_____)  v' + version + '\n\nIf you need help or want a new feature, visit https://github.com/nibogd/ingress-ice/issues');
}

/**
* Log in using cookies
* @param {String} sacsid
* @param {String} csrf
* @since 3.1.0
*/
function addCookies(sacsid, csrf) {
  phantom.addCookie({
    name: 'SACSID',
    value: sacsid,
    domain: 'www.ingress.com',
    path: '/',
    httponly: true,
    secure: true
  });
  phantom.addCookie({
    name: 'csrftoken',
    value: csrf,
    domain: 'www.ingress.com',
    path: '/'
  });
}

/**
* Log in to google. Doesn't use post, because URI may change.
* Fixed in 3.0.0 -- obsolete versions will not work (google changed login form)
* @param l - google login
* @param p - google password
*/
function login(l, p) {
  page.evaluate(function (l) {
    document.getElementById('Email').value = l;
  }, l);
  page.evaluate(function () {
    document.querySelector("#next").click();
  });
  window.setInterval(function () {
    page.evaluate(function (p) {
      document.getElementById('Passwd').value = p;
    }, p);
    page.evaluate(function () {
      document.querySelector("#next").click();
    });
    page.evaluate(function () {
      document.getElementById('gaia_loginform').submit();
    });
  }, loginTimeout / 10);
}

/**
* Check if logged in successfully, quit if failed, accept appEngine request if needed and prompt for two step code if needed.
*/
function checkLogin() {
  
  //announce('URI is now ' + page.url.substring(0,40) + '...');
  
  if (page.url.substring(0,40) === 'https://accounts.google.com/ServiceLogin') {quit('login failed: wrong email and/or password');}
    
    if (page.url.substring(0,40) === 'https://appengine.google.com/_ah/loginfo') {
      announce('Accepting appEngine request...');
      page.evaluate(function () {
	document.getElementById('persist_checkbox').checked = true;
	document.getElementsByTagName('form').submit();
      });
    }
    
    if (page.url.substring(0,44) === 'https://accounts.google.com/signin/challenge') {
      announce('Using two-step verification, please enter your code:');
      twostep = system.stdin.readLine();
    }
    
    if (twostep) {
      page.evaluate(function (code) {
	document.getElementById('totpPin').value = code;
      }, twostep);
      page.evaluate(function () {
	document.getElementById('submit').click();
	document.getElementById('challenge').submit();
      });
    }
}

/**
* Does all stuff needed after login/password authentication
* @since 3.1.0
*/
function afterPlainLogin() {
  window.setTimeout(function () {
    announce('Verifying login...');
    checkLogin();
    window.setTimeout(function () {
      page.open(area, function () {
	storeCookies();
	if (iitc) {
	  addIitc();
	}
	setTimeout(function () {
	  announce('Will start screenshooting in ' + v/1000 + ' seconds...');
	  if (((minlevel > 1)||(maxlevel < 8)) && !iitc) {
	    setMinMax(minlevel, maxlevel);
	  } else if (!iitc) {
	    page.evaluate(function () {
	      document.querySelector("#filters_container").style.display= 'none';
	    });
	  }
	  hideDebris(iitc);
	  prepare(iitc, width, height);
	  announce('The first screenshot may not contain all portals, it is intended for you to check framing.');
	  main();
	  setInterval(main, v);
	}, loginTimeout);
      });
    }, loginTimeout);
  }, loginTimeout);
}

/**
* Does all stuff needed after cookie authentication
* @since 3.1.0
*/
function afterCookieLogin() {
  page.open(area, function () {
    if(!isSignedIn()) {
      removeCookieFile();
      if(l && p) {
	firePlainLogin();
	return;
      } else {
	quit('User not logged in');
      }
    }
    if (iitc) {
      addIitc();
    }
    setTimeout(function () {
      announce('Will start screenshooting in ' + v/1000 + ' seconds...');
      if (((minlevel > 1)||(maxlevel < 8)) && !iitc) {
	setMinMax(minlevel, maxlevel, iitc);
      } else if (!iitc) {
	page.evaluate(function () {
	  document.querySelector("#filters_container").style.display= 'none';
	});
      }
      hideDebris(iitc);
      prepare(iitc, width, height);
      announce('The first screenshot may not contain all portals, it is intended for you to check framing.');
      main();
      setInterval(main, v);
    }, loginTimeout);
  });
}

/**
* Checks if user is signed in by looking for the "Sign in" button
* @returns {boolean}
* @author mfcanovas (github.com/mfcanovas)
* @since 3.2.0
*/
function isSignedIn() {
  return page.evaluate(function() {
    var btns = document.getElementsByClassName('button_link');
    for(var i = 0; i<btns.length;i++) {
      if(btns[i].innerText.trim() === 'Sign in') return false;
    }
    return true;
  });
  
}

/**
* Screenshots counter
* @var {number} curnum
* @var {number} ssnum
*/
function count() {
  if ((curnum >= ssnum)&&(ssnum !== 0)) {
    announce('Finished sucessfully. Exiting...\nThanks for using ingress-ice!');
    phantom.exit();
  } else if (ssnum !== 0) {
    announce('Screen #' + (curnum + 1) + '/' + ssnum + ' captured');
    curnum++;
  }
}

/**
* Hide debris on the map like selectors
* @param {boolean} iitcz
*/
function hideDebris(iitcz) {
  if (!iitcz) {
    page.evaluate(function () {
      if (document.querySelector('#comm'))           {document.querySelector('#comm').style.display = 'none';}
      if (document.querySelector('#player_stats'))   {document.querySelector('#player_stats').style.display = 'none';}
      if (document.querySelector('#game_stats'))     {document.querySelector('#game_stats').style.display = 'none';}
      if (document.querySelector('#geotools'))       {document.querySelector('#geotools').style.display = 'none';}
      if (document.querySelector('#header'))         {document.querySelector('#header').style.display = 'none';}
      if (document.querySelector('#snapcontrol'))    {document.querySelector('#snapcontrol').style.display = 'none';}
      if (document.querySelectorAll('.img_snap')[0]) {document.querySelectorAll('.img_snap')[0].style.display = 'none';}
      if (document.querySelector('#display_msg_text')) {document.querySelector('#display_msg_text').style.display = 'none';}
    });
    page.evaluate(function () {
      var hide = document.querySelectorAll('.gmnoprint');
      for (var index = 0; index < hide.length; ++index) {
	hide[index].style.display = 'none';
      }
    });
  } else {
    window.setTimeout(function () {
      page.evaluate(function () {
	if (document.querySelector('#chat'))                            {document.querySelector('#chat').style.display = 'none';}
	if (document.querySelector('#chatcontrols'))                    {document.querySelector('#chatcontrols').style.display = 'none';}
	if (document.querySelector('#chatinput'))                       {document.querySelector('#chatinput').style.display = 'none';}
	if (document.querySelector('#updatestatus'))                    {document.querySelector('#updatestatus').style.display = 'none';}
	if (document.querySelector('#sidebartoggle'))                   {document.querySelector('#sidebartoggle').style.display = 'none';}
	if (document.querySelector('#scrollwrapper'))                   {document.querySelector('#scrollwrapper').style.display = 'none';}
	if (document.querySelector('.leaflet-control-container')) {document.querySelector('.leaflet-control-container').style.display = 'none';}
      });
    }, 2000);
  }
}

/**
* Adds a timestamp to a screenshot
* @since 2.3.0
* @param {String} time
* @param {boolean} iitcz
*/
function addTimestamp(time, iitcz) {
  if (!iitcz) {
    page.evaluate(function (dateTime) {
      var water = document.createElement('p');
      water.id='watermark-ice';
      water.innerHTML = dateTime;
      water.style.position = 'absolute';
      water.style.color = 'orange';
      water.style.top = '0';
      water.style.left = '0';
      water.style.fontSize = '40px';
      water.style.opacity = '0.8';
      water.style.marginTop = '0';
      water.style.paddingTop = '0';
      water.style.fontFamily = 'monospace';
      document.querySelector('#map_canvas').appendChild(water);
    }, time);
  } else {
    page.evaluate(function (dateTime) {
      var water = document.createElement('p');
      water.id='watermark-ice';
      water.innerHTML = dateTime;
      water.style.position = 'absolute';
      water.style.color = '#3A539B';
      water.style.top = '0';
      water.style.zIndex = '4404';
      water.style.marginTop = '0';
      water.style.paddingTop = '0';
      water.style.left = '0';
      water.style.fontSize = '40px';
      water.style.opacity = '0.8';
      water.style.fontFamily = 'monospace';
      document.querySelectorAll('body')[0].appendChild(water);
    }, time);
  }
}

/**
* Inserts IITC and defines settings
* @var hideRes
* @var hideEnl
* @var hideLink
* @var hideField
* @var minlevel
* @var maxlevel
* @author akileos (https://github.com/akileos)
* @author Nikitakun
*/
function addIitc() {
  page.evaluate(function(field, link, res, enl, min, max) {
    localStorage['ingress.intelmap.layergroupdisplayed'] = JSON.stringify({
      "Unclaimed Portals":Boolean(min === 1),
      "Level 1 Portals":Boolean(min === 1),
      "Level 2 Portals":Boolean((min <= 2) & (max >= 2)),
      "Level 3 Portals":Boolean((min <= 3) & (max >= 3)),
      "Level 4 Portals":Boolean((min <= 4) & (max >= 4)),
      "Level 5 Portals":Boolean((min <= 5) & (max >= 5)),
      "Level 6 Portals":Boolean((min <= 6) & (max >= 6)),
      "Level 7 Portals":Boolean((min <= 7) & (max >= 7)),
      "Level 8 Portals":Boolean(max === 8),
      "Fields":field,
      "Links":link,
      "Resistance":res,
      "Enlightened":enl,
      "DEBUG Data Tiles":false,
      "Artifacts":true,
      "Ornaments":true
    });
    var script = document.createElement('script');
    script.type='text/javascript';
    script.src='https://secure.jonatkins.com/iitc/release/total-conversion-build.user.js';
    document.head.insertBefore(script, document.head.lastChild);
  }, !hideField, !hideLink, !hideRes, !hideEnl, minlevel, maxlevel);
}

/**
* Prepare map for screenshooting. Make screenshots same width and height with map_canvas
* If IITC, also set width and height
* @param {boolean} iitcz
* @param {number} widthz
* @param {number} heightz
*/
function prepare(iitcz, widthz, heightz) {
  if (!iitcz) {
    var selector = "#map_canvas";
    setElementBounds(selector);
  } else {
    window.setTimeout(function () {
      page.evaluate(function (w, h) {
	var water = document.createElement('p');
	water.id='viewport-ice';
	water.style.position = 'absolute';
	water.style.top = '0';
	water.style.marginTop = '0';
	water.style.paddingTop = '0';
	water.style.left = '0';
	water.style.width = w;
	water.style.height = h;
	document.querySelectorAll('body')[0].appendChild(water);
      }, widthz, heightz);
      var selector = "#viewport-ice";
      setElementBounds(selector);
    }, 4000);
  }
}

/**
* Sets element bounds
* @param selector
*/
function setElementBounds(selector) {
  page.clipRect = page.evaluate(function(selector) {
    var clipRect = document.querySelector(selector).getBoundingClientRect();
    return {
      top:     clipRect.top,
      left:     clipRect.left,
      width:  clipRect.width,
      height: clipRect.height
    };
  }, selector);
}

/**
* Checks if human presence not detected and makes a human present
* @since 2.3.0
*/
function humanPresence() {
  var outside = page.evaluate(function () {
    return !!(document.getElementById('butterbar') && (document.getElementById('butterbar').style.display !== 'none'));
  });
  if (outside) {
    var rekt = page.evaluate(function () {
      return document.getElementById('butterbar').getBoundingClientRect();
    });
    page.sendEvent('click', rekt.left + rekt.width / 2, rekt.top + rekt.height / 2);
  }
}

/**
* Main function. Wrapper for others.
*/
function main() {
  count();
  if (timestamp) {
    page.evaluate(function () {
      if (document.getElementById('watermark-ice')) {
	var oldStamp = document.getElementById('watermark-ice');
	oldStamp.parentNode.removeChild(oldStamp);
      }
    });
  }
  if (!iitc) {
    humanPresence();
    hideDebris(iitc);
  } else {
    page.evaluate(function () {
      idleReset();
    });
  }
  window.setTimeout(function () {
    if (timestamp) {
      addTimestamp(getDateTime(), iitc);
    }
    s();
  }, 2000);
}

/**
* Checks if cookies file exists. If so, it sets SACSID and CSRF vars
* @returns {boolean}
* @author mfcanovas (github.com/mfcanovas)
* @since 3.2.0
*/
function cookiesFileExists() {
  if(fs.exists(cookiespath)) {
    var stream = fs.open(cookiespath, 'r');
    
    while(!stream.atEnd()) {
      var line = stream.readLine();
      var res = line.split('=');
      if(res[0] === 'SACSID') {
	cookieSACSID = res[1];
      } else if(res[0] === 'csrftoken') {
	cookieCSRF = res[1];
      }
    }
    stream.close();
    return true;
  } else {
    return false;
  }
}

/**
* Remove cookies file if exists
* @author mfcanovas (github.com/mfcanovas)
* @since 3.2.0
*/
function removeCookieFile() {
  if(fs.exists(cookiespath)) {
    fs.remove(cookiespath);
  }
}

function storeCookies() {
  var cookies = page.cookies;
  fs.write(cookiespath, '', 'w');
  for(var i in cookies) {
    fs.write(cookiespath, cookies[i].name + '=' + cookies[i].value +'\n', 'a');
  }
}

/**
* Fires plain login
*/
function firePlainLogin() {
  cookieSACSID = '';
  cookieCSRF = '';
  page.open('https://www.ingress.com/intel', function (status) {
    
    if (status !== 'success') {quit('cannot connect to remote server');}
    
    var link = page.evaluate(function () {
      return document.getElementsByTagName('a')[0].href;
    });
    
    announce('Logging in...');
    page.open(link, function () {
      login(l, p);
      afterPlainLogin();
    });
  });
}

//MAIN SCRIPT

checkSettings(minlevel, maxlevel);
greet();




if (configver !== 2 && !cookiesFileExists()) {
  firePlainLogin();
} else {
  announce('Using stored cookie');
  addCookies(cookieSACSID, cookieCSRF);
  afterCookieLogin();
}
