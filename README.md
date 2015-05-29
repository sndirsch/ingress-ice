[ingress-ice](http://ingress.divshot.io/) [![](https://img.shields.io/github/issues-raw/nibogd/ingress-ice.svg)](https://github.com/nibogd/ingress-ice/issues)
===========

Automatic screenshooter for ingress intel map.
![ice0](https://cloud.githubusercontent.com/assets/2771136/3548090/6441370c-08a6-11e4-9b0a-84a2992af060.png)
Features:
=========
 - Captures screenshots of ingress intel map every *n* seconds
 - Set your location 
 - Supports 2-step authentication
 - Doesn't require X server to be run
 - Set portal levels to display

If you like ICE and want to stay in touch, follow me:

[<img src="https://developers.google.com/+/images/branding/g+128.png" width="16"> +Ingress ICE](https://plus.google.com/u/0/b/115529923593338751190/115529923593338751190)

[<img src="https://g.twimg.com/Twitter_logo_blue.png" width="16"> @ingress_ice](https://twitter.com/ingress_ice)
[Download](https://github.com/nibogd/ingress-ice/archive/master.zip) 
========

On Red Hat based linux run the following to install the dependences:
```
sudo yum install fontconfig freetype libfreetype.so.6 libfontconfig.so.1 libstdc++.so.6
```

Usage
=====

### Windows

 1. Unpack the archieve wherever you want
 1. Double-Click `ingress-ice.cmd` and follow the instructions
 10. It will save captured screenshots with into `Ice-2014-07-13--09-13-37.png`, `Ice-2014-07-13--09-14-07.png`...

### Linux

 1. Unpack the archieve wherever you want
 1. Run `chmod +x ingress-ice&&./ingress-ice` in console and follow the instructions
 10. It will save captured screenshots with into `Ice-2014-07-13--09-13-37.png`, `Ice-2014-07-13--09-14-07.png`...

<hr>
ICE uses [PhantomJS](http://phantomjs.org/), it's binary is packed with the script.

Ingress trademark belongs to Google, Inc.
