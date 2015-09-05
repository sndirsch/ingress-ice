/**
* @file Ingress-ICE, the main script
* @author Nikitakun (https://github.com/nibogd)
* @version 4.0.0
* @license MIT
* @see {@link https://github.com/nibogd/ingress-ice|GitHub }
* @see {@link https://ingress.divshot.io/|Website }
* @TODO Add Amazon S3 interface
*/

"use strict";
//Initialize

/*global phantom */
/*global require */

var system    = require('system');
var args      = system.args;
var fs        = require('fs');
var version   = '4.0.0';
var filename  = 'ice.js'
var iceFolder = args[0].substring(0, args[0].length - filename.length) + 'modules/';
var iceModules= fs.list(iceFolder);

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

ice();
