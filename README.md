[ingress-ice](http://ingress.netlify.com/) [![Join the chat at https://gitter.im/nibogd/ingress-ice](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nibogd/ingress-ice?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
===========

Automatic screenshooter for ingress intel map.
![](https://cloud.githubusercontent.com/assets/2771136/7915684/cfaba8c4-0887-11e5-86b9-5b4fe05ababc.png)

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
 - Hide some features like fields or links from the map (IITC only)
 - It's portable — you can run ice from a flash drive or a DropBox folder
 - Can be run via [Docker](https://github.com/nibogd/ingress-ice/wiki/Docker) ([Docker Hub](https://hub.docker.com/r/nikitakun/ingress-ice/))

See our [samples](https://github.com/nibogd/ingress-ice/wiki/Example-Records).

[<img src="https://developers.google.com/+/images/branding/g+128.png" width="16"> +Ingress ICE](https://plus.google.com/u/0/115529923593338751190/posts)

[<img src="https://g.twimg.com/Twitter_logo_blue.png" width="16"> @ingress_ice](https://twitter.com/ingress_ice)
Download
========
### Stable
See [releases](https://github.com/nibogd/ingress-ice/releases) to download the latest stable version. On linux, you may need to install these [dependencies](https://github.com/nibogd/ingress-ice/wiki/Dependencies-(Linux)).
### Development
> *WARNING!* the development version may be unstable. It is also much bigger (contains executables for every platform).

You can download the whole ingress-ice using the [![Download ZIP](https://cloud.githubusercontent.com/assets/2771136/12703381/36d9adb4-c85b-11e5-81b1-ec0dbef9f679.png)](https://github.com/nibogd/ingress-ice/archive/master.zip) button on the top or clone this repo via git from the link on top. 

Usage
=====

> *WARNING!* ingress-ice may be considered against Ingress ToS (although it hasn't happened before). Use it at your own risk!

### Windows

 1. Unpack the archieve wherever you want
 2. Double-Click `ingress-ice.cmd` and follow the instructions
 3. It will save captured screenshots with into `ice-2014-07-13--09-13-37.png`, `ice-2014-07-13--09-14-07.png`...
 4. You can copy `ice/ingress-ice.conf.sample` to `ingress-ice.conf` in the ice root and enter your settings there, so you can have different configurations for every `ingress-ice`

If you want to reconfigure the script, just double click `reconfigure.cmd`. If you want to use cookies instead of login and password, see [cookies authentication](https://github.com/nibogd/ingress-ice/wiki/Cookies-Authentication).

### Linux/Mac OS X

 1. Unpack the archieve wherever you want
 2. Run `chmod +x ingress-ice.sh&&./ingress-ice.sh` in console and follow the instructions
 3. It will save captured screenshots with into `ice-2014-07-13--09-13-37.png`, `ice-2014-07-13--09-14-07.png`...
 5. You can run it from any folder where you want to save screenshots.

If you want to reconfigure the script, run `./ingress-ice.sh -r`. If you want to use cookies instead of login and password, see [cookies authentication](https://github.com/nibogd/ingress-ice/wiki/Cookies-Authentication). In case Ingress ICE crashes sometimes, run it with option `-s`: it will run ICE in an endless loop.

#### Creating videos

To create a video from your screenshots, you can use *MPlayer* [(Windows download)](http://oss.netfarm.it/mplayer-win32.php) (install from your repo if on linux). It includes a `mencoder` command. The following will produce an `.avi` video:
(Detailed instruction for windows [here](https://github.com/nibogd/ingress-ice/wiki/Creating-videos-(Windows)))
```
mencoder mf://*.png -mf w=1366:h=768:fps=4:type=png -ovc lavc -lavcopts vcodec=mpeg4:mbd=2:trell -oac copy -o ingress-ice.avi
```

Change 1366 and 768 to your width and height, fps=4 to your FPS (more FPS - faster video, but shorter)

#### Contributors
You can see the list [here](https://github.com/nibogd/ingress-ice/graphs/contributors).

#### Support
If you like Ingress Ice, [support us at Bountysource](https://salt.bountysource.com/teams/ingress-ice)!

<hr>
ICE uses [PhantomJS](http://phantomjs.org/), it's binary is packed with the script.

Ingress trademark belongs to Google, Inc.
