[ingress-ice](http://ingress.divshot.io/) [![Join the chat at https://gitter.im/nibogd/ingress-ice](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nibogd/ingress-ice?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
===========

Automatic screenshooter for ingress intel map.
![](https://cloud.githubusercontent.com/assets/2771136/7915684/cfaba8c4-0887-11e5-86b9-5b4fe05ababc.png)

> If you have Ice version < 3.0.0 and see errors like `ICE crashed. Reason: login failed: wrong email and/or password :(`, update ice! Google has changed it's login form.

Features:
=========
 - Captures screenshots of ingress intel map every *n* seconds
 - Set your location 
 - Authentication using login and password or [cookies](https://github.com/nibogd/ingress-ice/wiki/Cookies-Authentication) available
 - Supports 2-step authentication
 - Doesn't require X server to be run
 - Set portal levels to display
 - Use IITC (optionally)
 - Timestamp on screenshots (optionally)
 - Fully cross-platform: supports Windows, GNU/Linux and Mac OS X!
 - [Hide some features like fields or links from the map](https://github.com/nibogd/ingress-ice/wiki/Remove-features) (IITC only)

See our [samples](https://github.com/nibogd/ingress-ice/wiki/Example-Records).

[<img src="https://developers.google.com/+/images/branding/g+128.png" width="16"> +Ingress ICE](https://plus.google.com/u/0/115529923593338751190/posts)

[<img src="https://g.twimg.com/Twitter_logo_blue.png" width="16"> @ingress_ice](https://twitter.com/ingress_ice)
[Download](https://github.com/nibogd/ingress-ice/archive/master.zip) 
========

[Dependencies (Linux)](https://github.com/nibogd/ingress-ice/wiki/Dependencies-(Linux))

Usage
=====

> *WARNING!* ingress-ice may be considered against Ingress ToS (although it hasn't happened before). Use it at your own risk!

### Windows

 1. Unpack the archieve wherever you want
 2. Double-Click `ingress-ice.cmd` and follow the instructions
 4. It will save captured screenshots with into `Ice-2014-07-13--09-13-37.png`, `Ice-2014-07-13--09-14-07.png`...

If you want to reconfigure the script, just double click `reconfigure.cmd`. If you want to use cookies instead of login and password, see [cookies authentication](https://github.com/nibogd/ingress-ice/wiki/Cookies-Authentication).

### Linux/Mac OS X

 1. Unpack the archieve wherever you want
 2. Run `chmod +x ingress-ice&&./ingress-ice` in console and follow the instructions
 4. It will save captured screenshots with into `Ice-2014-07-13--09-13-37.png`, `Ice-2014-07-13--09-14-07.png`...

If you want to reconfigure the script, run `./ingress-ice -r` . See [CLI usage](https://github.com/nibogd/ingress-ice/wiki/Linux-CLI). If you want to use cookies instead of login and password, see [cookies authentication](https://github.com/nibogd/ingress-ice/wiki/Cookies-Authentication).

#### Creating videos

To create a video from your screenshots, you can use *MPlayer* [(Windows download)](http://oss.netfarm.it/mplayer-win32.php) (install from your repo if on linux). It includes a `mencoder` command. The following will produce an `.avi` video:
(Detailed instruction for windows [here](https://github.com/nibogd/ingress-ice/wiki/Creating-videos-(Windows)))
```
mencoder mf://*.png -mf w=1366:h=768:fps=4:type=png -ovc lavc -lavcopts vcodec=mpeg4:mbd=2:trell -oac copy -o ingress-ice.avi
```

Change 1366 and 768 to your width and height, fps=4 to your FPS (more FPS - faster video, but shorter)

#### [Contributors](https://github.com/nibogd/ingress-ice/graphs/contributors)

 * @nibogd — authpr;
 * @c2nprds — optimizations; Amazon S3 upload method (will be available in version 4.1)
 * @mfcanovas — Cookies storing for login authentication;
 * @pheanex — First version of Dockerfile;
 * @tom-eagle92 — Mac OS X support;

 All contributors of PhantomJS;

<hr>
ICE uses [PhantomJS](http://phantomjs.org/), it's binary is packed with the script.

Ingress trademark belongs to Google, Inc.
