@echo off
REM ingress-ice start script by Nikitakun
REM (http://github.com/nibogd/ingress-ice)
REM               SETTINGS 
REM Set GOOGLELOGIN to your google login,
REM PASSWORD to your password, AREA to yo
REM ur link (read README.md or 
REM http://github.com/nibogd/ingress-ice)
REM , MINLEVEL to minimum portal level (s
REM et to 1 to display all available port
REM als), MAXLEVEL to maximum portal leve
REM l (highest portal level, set to 8 to 
REM display all), DELAY to delay between 
REM capturing screenshots, FOLDER to fold
REM er where to save (with \ on the end, 
REM . means current folder), NUMBER to nu
REM of screenshots to take (0 for infinit
REM y)

set GOOGLELOGIN=changeThisToYourGoogleLogin
set PASSWORD=setThisToYourPassword
set AREA="https://www.ingress.com/intel?ll=35.682398,139.693909&z=11"
set MINLEVEL=1
set MAXLEVEL=8
set DELAY=120
set WIDTH=900
set HEIGHT=500
set FOLDER=.\
set NUMBER=0
set LOGLEVEL=3

rem DO NOT EDIT ANYTHING BELOW THIS LINE

phantomjs.exe ice.js %GOOGLELOGIN% %PASSWORD% %AREA% %MINLEVEL% %MAXLEVEL% %DELAY% %WIDTH% %HEIGHT% %FOLDER% %NUMBER% %LOGLEVEL%
pause
