ingress-ice [![GratiPay](http://img.shields.io/gratipay/ni_bogd.svg)](https://gratipay.com/ni_bogd/) [![GitHub stars](https://img.shields.io/github/stars/nibogd/ingress-ice.svg)](https://github.com/nibogd/ingress-ice) [![](https://img.shields.io/github/issues-raw/nibogd/ingress-ice.svg)](https://github.com/nibogd/ingress-ice) 
===========

Automatic screenshooter for ingress intel map.
![ice0](https://cloud.githubusercontent.com/assets/2771136/3548090/6441370c-08a6-11e4-9b0a-84a2992af060.png)
Features:
=========
 - Captures screenshots of ingress intel map every *n* seconds
 - Set your location 
 - Supports 2-step authentication
 - Doesn't require X server to be run.

[Download](https://github.com/nibogd/ingress-ice/releases) [![GitHub release](https://img.shields.io/github/release/nibogd/ingress-ice.svg)](https://github.com/nibogd/ingress-ice/releases/)
========

On Red Hat based linux run the following to install the dependences:
```
sudo yum install fontconfig freetype libfreetype.so.6 libfontconfig.so.1 libstdc++.so.6
```

Usage
=====
Unpack the archieve wherever you want.

Change the variables in the script. Open `ice.js` with your favourite editor and set the `l` variable to your google login (fill it in the quotes), `p` variable to your google password (required for viewing the map, don't worry, we don't store your passwords). In the fourth line inscribe the link to your location in Ingress Intel, to get it:
 - Navigate to [Ingress Intel Map](http://ingress.com/intel)
 - Zoom to the location you want to capture
 - Click on the 'link' button in the top right corner and copy the link.

The link contains your longitude and latitude and zoom level. For Tokyo it is https://www.ingress.com/intel?ll=35.682398,139.693909&z=11 . In the 4th line set the delay between screenshot captures in milliseconds (1s = 1000ms). 

When the variables are set, run the file:
- On windows start `start.cmd`
- On linux run `./phantomjs ice.js` from the console

If you use 2-factor authentication, you will be prompted for the code.

It will save captured screenshots with into `Ice-2014-07-13--09-13-37.png`, `Ice-2014-07-13--09-14-07.png`...

ICE uses [PhantomJS](http://phantomjs.org/), it's binary is packed with the script.
<hr>
Ingress trademark belongs to Google, Inc.
