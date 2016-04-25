/**
 * @file Ingress-ICE, configurations
 * @license MIT
 */

/*global fs */
/*global quit */
/*global args */

var cookiespath = '.iced_cookies';
var config = configure(args[1]);

// Check if no login/password/link provided
if (
  (
    (
      typeof config.login == 'undefined' || config.login === '' ||
      typeof config.password == 'undefined' || config.password === ''
    ) && (
      typeof config.SACSID == 'undefined' || config.SACSID === '' ||
      typeof config.CSRF == 'undefined' || config.CSRF === ''
    )
  ) || (
    typeof config.area == 'undefined' || config.area === ''
  )) {
  quit('No login/password/area link specified. You need to reconfigure ice:\n - Double-click reconfigure.cmd on Windows;\n - Start ./ingress-ice -r on Linux/Mac OS X/*BSD;');
}

if (config.directory == '' || config.directory == undefined) {
  config.directory = 'screenshots/'
}

var folder = fs.workingDirectory + '/' + config.directory;
var ssnum = 0;
if (args[2]) {
  ssnum = parseInt(args[2], 10);
}

/**
 * Counter for number of screenshots
 */
var curnum       = 0;

/**
 * Take single screenshot and exit via setting delay=-1
 * @since 4.3.0
 */
if (config.delay == -1) {
  ssnum = 1;
  config.delay = 300000;
  //announce('Will take a single screenshot and exit');
}

/**
 * Delay between logging in and checking if successful
 * @default 10000
 */
var loginTimeout = config.loginTimeout;
if (loginTimeout == undefined || loginTimeout == '') {
  loginTimeout = 10000;
}

/**
 * Presets for settings not present in old versions of ice
 */
if (config.timezone == undefined || config.timezone == '') {
  config.timezone = false;
}

/**
 * twostep auth trigger
 */
var twostep      = 0;
var webpage      = require('webpage');
var page         = webpage.create();
page.onConsoleMessage = function() {};
page.onError  = function() {};

if (config.consoleLog !== undefined && config.consoleLog !== '') {
  page.onConsoleMessage = function(msg, lineNum, sourceId) {
    try {
      fs.write(config.consoleLog, msg + '\n', 'a');
    } catch(e) {
      announce(e);
    }
  };
}

/**
 * aborting unnecessary API
 * @since 4.0.0
 * @author c2nprds
 */
if (!config.iitc) {
  page.onResourceRequested = function(requestData, request) {
    if (requestData.url.match(/(getGameScore|getPlexts|getPortalDetails)/g)) {
      request.abort();
    }
  };
}

/** @function setVieportSize */
if (!config.iitc) {
  page.viewportSize = {
    width: config.width + 42,
    height: config.height + 167
  };
} else {
  page.viewportSize = {
    width: config.width,
    height: config.height
  };
}

/**
 * Parse the configuration .conf file
 * @since 4.0.0
 * @param {String} path
 */
function configure(path) {
  var settings = {};
  var settingsfile = fs.open(path, 'r');
  while(!settingsfile.atEnd()) {
    var line = settingsfile.readLine();
    if (!(line[0] === '#' || line[0] === '[' || line.indexOf('=', 1) === -1)) {
      var pos = line.indexOf('=', 1);
      var key = line.substring(0,pos);
      var value = line.substring(pos + 1);
      if (value == 'false') {
        settings[key] = false;
      } else if (/^-?[\d.]+(?:e-?\d+)?$/.test(value) && value !== '') {
        settings[key] = parseInt(value, 10);
      } else {
        settings[key] = value;
      }
    }
  }
  settingsfile.close();
  return settings;
}
