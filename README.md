[ingress-ice](http://ingress.netlify.com/)
===========
Automatic screenshooter for ingress intel map.

v4.5.3 "final" release. Development will not be continued.

Features:
=========
 - Captures screenshots of ingress intel map every *n* seconds
 - Set your location 
 - Authentication using login and password or cookies available
 - Supports 2-step authentication
 - Doesn't require X server to be run
 - Set portal levels to display
 - Use IITC (optionally)
 - Timestamp on screenshots (optionally)
 - Fully cross-platform: supports Windows, GNU/Linux and Mac OS X!
 - Hide some features like fields or links from the map (IITC only)
 - It's portable — you can run ice from a flash drive or a DropBox folder
 - Can be run via Docker (see the Dockerfile for usage)

Usage
=====
> *WARNING!* ingress-ice may be considered against Ingress ToS (although it hasn't happened before). Use it at your own risk!

### Windows
 1. Unpack the archieve wherever you want
 2. Double-Click `ingress-ice.cmd` and follow the instructions
 3. It will save captured screenshots with into `ice-2014-07-13--09-13-37.png`, `ice-2014-07-13--09-14-07.png`...
 4. You can copy `ice/ingress-ice.conf.sample` to `ingress-ice.conf` in the ice root and enter your settings there, so you can have different configurations for every `ingress-ice`

If you want to reconfigure the script, just double click `reconfigure.cmd`.

### Linux/Mac OS X
 1. Unpack the archieve wherever you want
 2. Run `chmod +x ingress-ice.sh&&./ingress-ice.sh` in console and follow the instructions
 3. It will save captured screenshots with into `ice-2014-07-13--09-13-37.png`, `ice-2014-07-13--09-14-07.png`...
 5. You can run it from any folder where you want to save screenshots.

If you want to reconfigure the script, run `./ingress-ice.sh -r`. In case Ingress ICE crashes sometimes, run it with option `-s`: it will run ICE in an endless loop.

#### Creating videos
To create a video from your screenshots, you can use *MPlayer* [(Windows download)](http://oss.netfarm.it/mplayer-win32.php) (install from your repo if on linux). It includes a `mencoder` command. The following will produce an `.avi` video:
```
mencoder mf://*.png -mf w=1366:h=768:fps=4:type=png -ovc lavc -lavcopts vcodec=mpeg4:mbd=2:trell -oac copy -o ingress-ice.avi
```

Change 1366 and 768 to your width and height, fps=4 to your FPS (more FPS - faster video, but shorter)

#### Troubleshooting
If you have problems logging in, that may be a CAPTCHA. Try visiting https://accounts.google.com/displayunlockcaptcha and following the instructions.

#### Contributors
[the main dev](https://ingress.netlify.com)
[c2nprds](https://github.com/c2nprds)
[serjvanilla](https://github.com/serjvanilla)
[pheanex](https://github.com/pheanex)
[mxxcon](https://github.com/mxxcon)
[mfcanovas](https://github.com/mfcanovas)
[sndirsch](https://github.com/sndirsch)
[CyBot](https://github.com/CyBot)
[fesse](https://github.com/fesse)
[tom-eagle92](https://github.com/tom-eagle92)
[rawdr](https://github.com/rawdr)
[mcdoubleyou](https://github.com/mcdoubleyou)
[RomanIsko](https://github.com/RomanIsko)
[jankatins](https://github.com/jankatins)
[EdJoPaTo](https://github.com/EdJoPaTo)

#### Backers
See backers.md.
