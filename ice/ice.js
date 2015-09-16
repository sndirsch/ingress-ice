/**
* @file Ingress-ICE, the main script
* @author Nikitakun (https://github.com/nibogd)
* @version 4.0.1
* @license MIT
* @see {@link https://github.com/nibogd/ingress-ice|GitHub }
* @see {@link https://ingress.divshot.io/|Website }
* @TODO Add Amazon S3 interface
*/

"use strict";
//Initialize

/*global phantom */
/*global require */
/*global ice */

var system    = require('system');
var args      = system.args;
var fs        = require('fs');
var version   = '4.0.1';
var filename  = 'ice.js';
var iceFolder = args[0].substring(0, args[0].length - filename.length) + 'modules/';
var iceModules= fs.list(iceFolder);

/*
* Loads all scripts in the 'modules' folder
*/
phantom.injectJs('ice/modules/ice-utils.js');
phantom.injectJs('ice/modules/ice-aws.js');
phantom.injectJs('ice/modules/ice-config.js');
phantom.injectJs('ice/modules/ice-setminmax.js');
phantom.injectJs('ice/modules/ice-features-extra.js');
phantom.injectJs('ice/modules/ice-features-main.js');
phantom.injectJs('ice/modules/ice-login-cookies.js');
phantom.injectJs('ice/modules/ice-login-plain.js');
// function loadModules() {
//   for(var i = 0; i < iceModules.length; i++) {
//     var file = iceFolder + iceModules[i];
//     if(fs.isFile(file)){
//       phantom.injectJs(file);
//     }
//   }
// }

// loadModules();
ice();
