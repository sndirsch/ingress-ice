/**
 * @file Ingress-ICE, the main script
 * @author Nikitakun (https://github.com/nibogd)
 * @version 2.3.0
 * @license MIT
 * @see {@link https://github.com/nibogd/ingress-ice|GitHub }
 * @see {@link https://ingress.divshot.io/|Website }
 */

"use strict";
//Initialize

var system   = require('system');
var args     = system.args;

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
if (isNaN(args[1])) {
    var l            = args[1];
    var p            = args[2];
    var area         = args[3];
    var minlevel     = parseInt(args[4], 10);
    var maxlevel     = parseInt(args[5], 10);
    var v            = 1000 * parseInt(args[6], 10);
    var width        = parseInt(args[7], 10);
    var height       = parseInt(args[8], 10);
    var folder       = args[9];
    var ssnum        = args[10];
    var loglevel     = args[11];
    iitc             = 0;
    timestamp        = 0;
} else if (parseInt(args[1], 10)>=1) {
    var configver    = parseInt(args[1], 10);
    var l            = args[2];
    var p            = args[3];
    var area         = args[4];
    var minlevel     = parseInt(args[5], 10);
    var maxlevel     = parseInt(args[6], 10);
    var v            = 1000 * parseInt(args[7], 10);
    var width        = parseInt(args[8], 10);
    var height       = parseInt(args[9], 10);
    var folder       = args[10];
    var ssnum        = args[11];
    var iitc         = parseInt(args[12], 10);
    var timestamp    = parseInt(args[13], 10);
}

/**
 * Counter for number of screenshots
 */
var curnum       = 0;
var version      = '2.3.0';

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
    if(month.toString().length == 1) {
        var month = '0' + month;
    }
    if(day.toString().length == 1) {
        var day = '0' + day;
    }
    if(hour.toString().length == 1) {
        var hour = '0' + hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0' + minute;
    }
    if(second.toString().length == 1) {
        var second = '0' + second;
    }
    if (format==1) {
        var dateTime = year + '-' + month + '-' + day + '--' + hour + '-' + minute + '-' + second;
    } else {
        var dateTime = day + '.' + month + '.' + year + ' '+hour+':'+minute+':'+second;
    }
    return dateTime;
}

/**
 * Sets minimal and maximal portal levels (filter) by clicking those buttons on filter panel.
 * 10 000 ms will be enough
 * @summary Portal level filter
 * @param {number} min - minimal portal level
 * @param {number} max - maximum portal level
 * @param {boolean} iitcz
 */
function setMinMax(min, max, iitcz) {
    if (!iitcz) {
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
                if (max == 8) {
                    page.evaluate(function () {
                        document.querySelector('#filters_container').style.display = 'none';
                    });
                }
            }, 2000);
        };
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
                }, 2000)
            }, 4000)
        }
    } else {
        window.setTimeout(function () {
            page.evaluate(function (min, max) {
                if (min > 1) {
                    switch (min) {
                        case 8: document.getElementsByClassName("leaflet-control-layers-selector")[15].checked = false;
                        case 7: document.getElementsByClassName("leaflet-control-layers-selector")[14].checked = false;
                        case 6: document.getElementsByClassName("leaflet-control-layers-selector")[13].checked = false;
                        case 5: document.getElementsByClassName("leaflet-control-layers-selector")[12].checked = false;
                        case 4: document.getElementsByClassName("leaflet-control-layers-selector")[11].checked = false;
                        case 3: document.getElementsByClassName("leaflet-control-layers-selector")[10].checked = false;
                        case 2: document.getElementsByClassName("leaflet-control-layers-selector")[9].checked = false;
                    }
                }
                if (max < 8) {
                    switch (max) {
                        case 1: document.getElementsByClassName("leaflet-control-layers-selector")[10].checked = false;
                        case 2: document.getElementsByClassName("leaflet-control-layers-selector")[11].checked = false;
                        case 3: document.getElementsByClassName("leaflet-control-layers-selector")[12].checked = false;
                        case 4: document.getElementsByClassName("leaflet-control-layers-selector")[13].checked = false;
                        case 5: document.getElementsByClassName("leaflet-control-layers-selector")[14].checked = false;
                        case 6: document.getElementsByClassName("leaflet-control-layers-selector")[15].checked = false;
                        case 7: document.getElementsByClassName("leaflet-control-layers-selector")[16].checked = false;
                    }
                }
            }, min, max);
        }, v/10);
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
 * Check if all mandatory settings are correct and quit if not
 * @param {String} l - google login
 * @param {String} p - google password
 * @param {number} minlevel - minimal portal level
 * @param {number} maxlevel - maximal portal level
 * @param {String} area - Link to a place at the ingress map
 */
function checkSettings(l, p, minlevel, maxlevel, area) {
    if (!l | !p) {
        quit('you haven\'t entered your login and/or password');
    };
    if ((minlevel < 0 | minlevel > 8) | (maxlevel < 0 | maxlevel > 8) | (!minlevel | !maxlevel)) {
        quit('the lowest and/or highest portal levels were not set or were set wrong');
    };
    if (minlevel>maxlevel) {
        quit('lowest portal level is higher than highest. Isn\'t that impossible?!');
    };
    if (!area | area == 0) {
        quit('you forgot to set the location link, didn\'t you?');
    };
}

/**
 * Greeter. Beautiful ASCII-Art logo.
 */
function greet() {
    console.log('\n     _____ )   ___      _____) \n    (, /  (__/_____)  /        \n      /     /         )__      \n  ___/__   /        /          \n(__ /     (______) (_____)  v' + version + '\n\nIf something doesn\'t work or if you want to submit a feature request, visit https://github.com/nibogd/ingress-ice/issues');
}

/**
 * Log in to google. Doesn't use post, because URI may change.
 * @param l - google login
 * @param p - google password
 */
function login(l, p) {
    page.evaluate(function (l) {
        document.getElementById('Email').value = l;
    }, l);

    page.evaluate(function (p) {
        document.getElementById('Passwd').value = p;
    }, p);

    page.evaluate(function () {
        document.querySelector("input#signIn").click();
    });

    page.evaluate(function () {
        document.getElementById('gaia_loginform').submit();
    });
}

/**
 * Check if logged in successfully, quit if failed, accept appEngine request if needed and prompt for two step code if needed.
 */
function checkLogin() {

    //announce('URI is now ' + page.url.substring(0,40) + '...');

    if (page.url.substring(0,40) == 'https://accounts.google.com/ServiceLogin') {quit('login failed: wrong email and/or password')};

        if (page.url.substring(0,40) == 'https://appengine.google.com/_ah/loginfo') {
            announce('Accepting appEngine request...');
            page.evaluate(function () {
                document.getElementById('persist_checkbox').checked = true;
                document.getElementsByTagName('form').submit();
            });
        }

        if (page.url.substring(0,40) == 'https://accounts.google.com/SecondFactor') {
            announce('Using two-step verification, please enter your code:');
            twostep = system.stdin.readLine();
        }

        if (twostep) {
            page.evaluate(function (code) {
                document.getElementById('smsUserPin').value = code;
            }, twostep);
            page.evaluate(function () {
                document.getElementById('gaia_secondfactorform').submit();
            });
        }
}

/**
 * Screenshots counter
 * @param {number} curnum
 * @param {number} ssnum
 */
function count() {
    if ((curnum>=ssnum)&&(ssnum!=0)) {
        announce('Finished sucessfully. Exiting...\nThanks for using ingress-ice!');
        phantom.exit();
    } else if (ssnum!=0) {
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
            if (document.querySelector('#comm'))           {document.querySelector('#comm').style.display = 'none'}
            if (document.querySelector('#player_stats'))   {document.querySelector('#player_stats').style.display = 'none'}
            if (document.querySelector('#game_stats'))     {document.querySelector('#game_stats').style.display = 'none'}
            if (document.querySelector('#geotools'))       {document.querySelector('#geotools').style.display = 'none'}
            if (document.querySelector('#header'))         {document.querySelector('#header').style.display = 'none'}
            if (document.querySelector('#snapcontrol'))    {document.querySelector('#snapcontrol').style.display = 'none'}
            if (document.querySelectorAll('.img_snap')[0]) {document.querySelectorAll('.img_snap')[0].style.display = 'none'}
        });
        page.evaluate(function () {
            var hide = document.querySelectorAll('.gmnoprint');
            for (index = 0; index < hide.length; ++index) {
                hide[index].style.display = 'none';
            }
        });
    } else {
        window.setTimeout(function () {
            page.evaluate(function () {
                if (document.querySelector('#chat'))                            {document.querySelector('#chat').style.display = 'none'}
                if (document.querySelector('#chatcontrols'))                    {document.querySelector('#chatcontrols').style.display = 'none'}
                if (document.querySelector('#chatinput'))                       {document.querySelector('#chatinput').style.display = 'none'}
                if (document.querySelector('#updatestatus'))                    {document.querySelector('#updatestatus').style.display = 'none'}
                if (document.querySelector('#sidebartoggle'))                   {document.querySelector('#sidebartoggle').style.display = 'none'}
                if (document.querySelector('#scrollwrapper'))                   {document.querySelector('#scrollwrapper').style.display = 'none'}
                if (document.querySelectorAll('.leaflet-control-container')[0]) {document.querySelectorAll('.leaflet-control-container')[0].style.display = 'none'}
            });
        }, 2000);
    }
}

/**
 * Adds a timestamp to a screenshot
 * @since 2.3.0
 * @param {boolean} timestampz
 * @param {String} time
 * @param {boolean} iitcz
 */
function timestampz(timestampz, time, iitcz) {
    if (timestampz) {
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
                document.querySelectorAll('body')[0].appendChild(water);
            }, time);
        }
    }
}

/**
 * Inserts IITC
 * @param {boolean} iitcz
 * @author akileos (https://github.com/akileos)
 * @author Nikitakun
 */
function iitcz(iitcz) {
    if (iitcz) {
        page.evaluate(function() {
            var script = document.createElement('script');
            script.type='text/javascript';
            script.src='https://secure.jonatkins.com/iitc/release/total-conversion-build.user.js';
            document.head.insertBefore(script, document.head.lastChild);
        });
    }
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
        var elementBounds = page.evaluate(function(selector) {
            var clipRect = document.querySelector(selector).getBoundingClientRect();
            return {
                top:     clipRect.top,
                left:     clipRect.left,
                width:  clipRect.width,
                height: clipRect.height
            };
        }, selector);
        var oldClipRect = page.clipRect;
        page.clipRect = elementBounds;
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
            var elementBounds = page.evaluate(function(selector) {
                var clipRect = document.querySelector(selector).getBoundingClientRect();
                return {
                    top:     clipRect.top,
                    left:     clipRect.left,
                    width:  clipRect.width,
                    height: clipRect.height
                };
            }, selector);
            var oldClipRect = page.clipRect;
            page.clipRect = elementBounds;
        }, 4000);
    }
}

/**
 * Checks if human presence not detected and makes a human present
 * @since 2.3.0
 */
function humanPresence() {
    var outside = page.evaluate(function () {
        if (document.getElementById('butterbar')&&(document.getElementById('butterbar').style.display !== 'none')) {
            return true;
        } else {
            return false;
        }
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
    } else {
        page.evaluate(function () {
            idleReset();
        });
    }
    window.setTimeout(function () {
        timestampz(timestamp, getDateTime(), iitc);
        s();
    }, 2000);
}
//MAIN SCRIPT

checkSettings(l, p, minlevel, maxlevel, area);
greet();

page.open('https://www.ingress.com/intel', function (status) {

    if (status !== 'success') {quit('cannot connect to remote server')};

        var link = page.evaluate(function () {
            return document.getElementsByTagName('a')[0].href;
        });

        announce('Logging in...');
        page.open(link, function () {

            login(l, p);
            window.setTimeout(function () {
                checkLogin();
                announce('Verifying login...');
                window.setTimeout(function () {
                    page.open(area, function () {
                        iitcz(iitc);
                        setTimeout(function () {
                            announce('Will start screenshooting in ' + v/1000 + ' seconds...');
                            if ((minlevel>1)|(maxlevel<8)){
                                setMinMax(minlevel, maxlevel, iitc);
                            } else if (!iitc) {
                                page.evaluate(function () {
                                    document.querySelector("#filters_container").style.display= 'none';
                                });
                            }
                            hideDebris(iitc);
                            prepare(iitc, width, height);
                            setInterval(main, v);
                        }, loginTimeout);
                    });
                }, loginTimeout);
            }, loginTimeout);

        });
});
