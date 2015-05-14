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

If you like ICE and want to stay in touch, follow me on G+: [<img src="https://developers.google.com/+/images/branding/g+128.png" width="16"> Ingress ICE](https://plus.google.com/u/0/b/115529923593338751190/115529923593338751190)

[Download](https://github.com/nibogd/ingress-ice/archive/master.zip) 
========

On Red Hat based linux run the following to install the dependences:
```
sudo yum install fontconfig freetype libfreetype.so.6 libfontconfig.so.1 libstdc++.so.6
```

Usage
=====
Unpack the archieve wherever you want.
View a beutiful instruction [here](http://ingress.divshot.io/)

### Windows

 1. Open `start.cmd` with your favourite editor
 2. Set the `GOOGLELOGIN` variable to your google login (write it instead of `changeThisToYourGoogleLogin`)
 2. Set the `PASSWORD` variable to your google password (required for viewing the map, don't worry, we don't store your passwords)
 4. `AREA` to your location in Ingress Intel, to get it:
   - Navigate to [Ingress Intel Map](http://ingress.com/intel)
   - Zoom to the location you want to capture
   - Click on the 'link' button in the top right corner and copy the link.
   For Tokyo it is https://www.ingress.com/intel?ll=35.682398,139.693909&z=11
 5. `DELAY` to the delay between screenshot captures in seconds
 6. Change other variables if necessary
 7. Double-click `start.cmd`
 8. Enjoy! :smile:
 9. If you use 2-factor authentication, you will be prompted for the code.
 10. It will save captured screenshots with into `Ice-2014-07-13--09-13-37.png`, `Ice-2014-07-13--09-14-07.png`...

### Linux


 1. Open `start.sh` with your favourite editor
 2. Set the `L` variable to your google login (write it into `""`)
 2. Set the `P` variable to your google password (required for viewing the map, don't worry, we don't store your passwords)
 4. `AREA` to your location in Ingress Intel, to get it:
   - Navigate to [Ingress Intel Map](http://ingress.com/intel)
   - Zoom to the location you want to capture
   - Click on the 'link' button in the top right corner and copy the link.
   For Tokyo it is https://www.ingress.com/intel?ll=35.682398,139.693909&z=11
 5. `V` to the delay between screenshot captures in seconds
 6. Change other variables if necessary
 7. Start `start.sh` in console
 8. Enjoy! :smile:
 9. If you use 2-factor authentication, you will be prompted for the code.
 10. It will save captured screenshots with into `Ice-2014-07-13--09-13-37.png`, `Ice-2014-07-13--09-14-07.png`...

<hr>
ICE uses [PhantomJS](http://phantomjs.org/), it's binary is packed with the script.

Ingress trademark belongs to Google, Inc.
