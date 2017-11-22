/**
 * @file Ingress-ICE, the main script
 * @author nibogd (https://github.com/nibogd)
 * @version 4.5.1
 * @license MIT
 * @see {@link https://github.com/nibogd/ingress-ice|GitHub }
 * @see {@link https://ingress.netlify.com/|Website }
 */

"use strict";

/*global phantom */
/*global require */
/*global ice */

var system    = require('system');
var args      = system.args;
var fs        = require('fs');
var version   = '4.5.2';
var filename  = 'ice.js';
var iceFolder = args[0].substring(0, args[0].length - filename.length) + 'modules/';
var iceModules= fs.list(iceFolder).sort();

/*
 * Loads all scripts in the 'modules' folder
 */
function loadModules() {
  for(var i = 0; i < iceModules.length; i++) {
    var file = iceFolder + iceModules[i];
    if(fs.isFile(file)){
      phantom.injectJs(file);
    }
  }
}

loadModules();
window.setTimeout(ice, 1000);
