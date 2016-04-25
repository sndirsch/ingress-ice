/**
 * @file Ingress-ICE, everything related to cookies login
 * @license MIT
 */

/*global announce */
/*global config */
/*global page */
/*global prepare */
/*global hideDebris */
/*global setMinMax */
/*global addIitc */
/*global loginTimeout */
/*global quit */
/*global firePlainLogin */
/*global phantom */
/*global main */
/*global fs */
/*global cookiespath */

/**
 * Checks if cookies file exists. If so, it sets SACSID and CSRF vars
 * @returns {boolean}
 * @author mfcanovas (github.com/mfcanovas)
 * @since 3.2.0
 */
function loadCookies() {
  if(fs.exists(cookiespath)) {
    var stream = fs.open(cookiespath, 'r');

    while(!stream.atEnd()) {
      var line = stream.readLine().split('=');
      if(line[0] === 'SACSID') {
        config.SACSID = line[1];
      } else if(line[0] === 'csrftoken') {
        config.CSRF = line[1];
      }
    }
    stream.close();
  }
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
 * Does all stuff needed after cookie authentication
 * @since 3.1.0
 */
function afterCookieLogin() {
  page.open(config.area, function(status) {
    if (status !== 'success') {quit('unable to connect to remote server')}

    if(!isSignedIn()) {
      if(fs.exists(cookiespath)) {
        fs.remove(cookiespath);
      }
      if(config.login && config.password) {
        page.deleteCookie('SACSID');
        page.deleteCookie('csrftoken');
        firePlainLogin();
        return;
      } else {
        quit('Cookies are obsolete. Update your config file.');
      }
    }
    if (config.iitc) {
      addIitc();
    }
    setTimeout(function() {
      announce('Will start screenshooting in ' + config.delay/1000 + ' seconds...');
      if (((config.minlevel > 1)||(config.maxlevel < 8)) && !config.iitc) {
        setMinMax(config.minlevel, config.maxlevel, config.iitc);
      } else if (!config.iitc) {
        page.evaluate(function() {
          document.querySelector("#filters_container").style.display= 'none';
        });
      }
      hideDebris(config.iitc);
      prepare(config.iitc, config.width, config.height);
      announce('The first screenshot may not contain all portals, it is intended for you to check framing.');
      main();
      setInterval(main, config.delay);
    }, loginTimeout);
  });
}

/**
 * Checks if user is signed in by looking for the "Sign in" button
 * @returns {boolean}
 * @since 3.2.0
 */
function isSignedIn() {
  return page.evaluate(function() {
    return document.getElementsByTagName('a')[0].innerText.trim() !== 'Sign in';
  });
}

function storeCookies() {
  var cookies = page.cookies;
  fs.write(cookiespath, '', 'w');
  for(var i in cookies) {
    fs.write(cookiespath, cookies[i].name + '=' + cookies[i].value +'\n', 'a');
  }
}
