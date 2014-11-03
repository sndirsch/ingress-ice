/* SETTINGS          */
var l = '';     //google login or email
var p = ''; //google password
var area = 'https://www.ingress.com/intel?ll=53.22792,50.203829&z=16';
var v = 30000;     //Delay between capturing screenshots, in milliseconds (1000 ms = 1 s)
var width = 900;   //Picture width
var height = 500; //Picture height
var folder = './'; //Folder where to save screenshots, with / (or \) on the end. '.' means current folder.
/* SGNITTES       */

var page = require('webpage').create();
var system = require('system');
var twostep = 0;
var val, message, Le;


var Version = '1.3.1';

page.viewportSize = {
   width: width + 42,
   height: height + 167
};

function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+'--'+hour+'-'+minute+'-'+second;   
    return dateTime;
};


function s() {
  console.log('Capturing screen from ' + getDateTime() + '...');
  page.render(folder + 'Ice-' + getDateTime() + '.png');
};

function quit(err) {
 if (err) {
  console.log('\nICE crashed. Reason: ' + err + ' :('); //nice XD
  } else {
   console.log('Quit');
  };

 phantom.exit();
};
if (!l | !p) {
 quit('you haven\'t entered your login and/or password');
};


console.log('\n ___   _______  _______ \n|   | |       ||       |\n|   | |       ||    ___|\n|   | |       ||   |___ \n|   | |      _||    ___|\n|   | |     |_ |   |___ \n|___| |_______||_______| v' + Version + ' (https://github.com/nibogd/ingress-ice)\n\nConnecting...');


window.setTimeout(function () {page.open('https://www.ingress.com/intel', function (status) {
 
 if (status !== 'success') {quit('cannot connect to remote server')};

 var inglink = page.evaluate(function () {
   return document.getElementsByTagName('a')[0].href; 
 });
 
 console.log('Logging in...');
 page.open(inglink, function () {
   
   page.evaluate(function (l) {
     document.getElementById('Email').value = l;
   }, l);

   page.evaluate(function (p) {
     document.getElementById('Passwd').value = p;
   }, p);

   page.evaluate(function () {
     document.querySelector("input#signIn").click();
   });

   page.evaluate(function () {
     document.getElementById('gaia_loginform').submit(); // Not using POST because the URI may change 
   });

   window.setTimeout(function () {
       console.log('URI is now ' + page.url.substring(0,40) + '... .\nVerifying login...');

       if (page.url.substring(0,40) == 'https://accounts.google.com/ServiceLogin') {quit('login failed: wrong email and/or password')};
       
       if (page.url.substring(0,40) == 'https://appengine.google.com/_ah/loginfo') {
          console.log('Accepting appEngine request...');
          page.evaluate(function () {
            document.getElementById('persist_checkbox').checked = true;
            document.getElementsByTagName('form').submit();
          });
       };

       if (page.url.substring(0,40) == 'https://accounts.google.com/SecondFactor') {
          console.log('Using two-step verification, please enter your code:');
          twostep = system.stdin.readLine();
       };
   
       if (twostep) {
          page.evaluate(function (code) {
            document.getElementById('smsUserPin').value = code;
          }, twostep);
          page.evaluate(function () {
            document.getElementById('gaia_secondfactorform').submit();
          });
       };
        window.setTimeout(function () {
          page.open(area, function () {
           console.log('Authenticated successfully, starting screenshotting every ' + v + 'ms...');
            setInterval(function () {
              page.evaluate(function () {
               document.querySelector('#filters_container').style.display = 'none';
               document.querySelector('#comm').style.display = 'none';
               document.querySelector('#player_stats').style.display = 'none';
               document.querySelector('#game_stats').style.display = 'none';
               document.querySelector('#geotools').style.display = 'none';
               document.querySelector('#bottom_right_stack').style.display = 'none';
               document.querySelector('#header').style.display = 'none';
               document.querySelector('#footer').style.display = 'none';
               document.querySelector('#snapcontrol').style.display = 'none';
               //document.querySelector('div.gm-style-cc:nth-child(8)').style.display = 'none';
              });
              page.evaluate(function () {
               var hide = document.querySelectorAll('.gmnoprint');
               for (index = 0; index < hide.length; ++index) {
                 hide[index].style.display = 'none';
              }});
              
              var mySelector = "#map_canvas";
              var elementBounds = page.evaluate(function(selector) {
                var clipRect = document.querySelector(selector).getBoundingClientRect();
                return {
                  top:     clipRect.top,
                  left:     clipRect.left,
                  width:  clipRect.width,
                  height: clipRect.height
                };
               }, mySelector);
              var oldClipRect = page.clipRect;
              page.clipRect = elementBounds;

             s();

             page.reload();
            }, v);
          });
        }, 10000);
   },5000);

 });
});
}, 5000);
