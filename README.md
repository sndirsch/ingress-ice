ingress-ice
===========

Automatic screenshooter for ingress intel map.

Features:
=========
 - Captures screenshots of ingress intel map every *n* seconds
 - Set your location 
 - Supports 2-step authentication
 - Doesn't require X server to be run.

Download
========
- [Windows](https://github.com/nibogd/ingress-ice/releases/tag/v1-win32)
- [Linux](https://github.com/nibogd/ingress-ice/releases/tag/v1-linux)

Usage
=====
Unpack the archieve wherever you want.

Change the variables in the script. Open `ice.js` with your favourite editor and set the `l` variable to your google login (fill it in the quotes), `p` variable to your google password (required for viewing the map, don't worry, we don't store your passwords). In the fourth line inscribe the link to your location in Ingress Intel, to get it:
 - Navigate to [Ingress Intel Map](http://ingress.com/intel)
 - Zoom to the location you want to capture
 - Click on the 'link' button in the top right corner and copy the link.

The link contains your longitude and latitude and zoom level. For Tokyo it is https://www.ingress.com/intel?ll=35.682398,139.693909&z=11 . In the 4th line set the delay between screenshot captures in milliseconds (1s = 1000ms). 

When the variables are set, run the file:
- On windows run `start.cmd`
- On linux run `./phantomjs ice.js' from the console

If you use 2-factor authentication, you will be prompted for the code.

It will save captured screenshots with into `Ice0.png`, `Ice1.png`...

ICE uses [PhantomJS](http://phantomjs.org/), it's binary is packed with the script.
<hr>
Ingress trademark belongs to Google, Inc.
