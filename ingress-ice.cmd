
@echo off
SETLOCAL EnableDelayedExpansion
REM ingress-ice start script by Nikitakun
REM (http://github.com/nibogd/ingress-ice)
REM Double-click this file and follow the
REM instructions

set FILE="%APPDATA%\.ingress-ice.conf"
IF '%1'=='/?' GOTO :help
IF '%1'=='-h' GOTO :help
IF '%1'=='-r' GOTO :config
GOTO :check
:check
IF EXIST %FILE% (
	GOTO :start
) else (
        copy ice\ingress-ice.conf.sample %FILE%
	GOTO :config
)
:config
cls
echo Ingress ICE, Automatic screenshooter for ingress intel map
echo.
echo I've created a blank configuration file for you.
echo Notepad will be opened now. Insert your settings, save the file and close the notepad. Ice will start automatically
echo.
echo You can edit your configuration any time, just start 'reconfigure.cmd'
echo.
notepad %FILE%
:start
cls
echo Existing config file found (%FILE%). Starting ice...
phantom-bin\phantomjs.exe ice\ice.js %FILE%
pause
goto :eof
:help
echo Ingress ICE, an automated screenshooter for ingress intel map
echo Copyright (c) Nikitakun (github.com/nibogd)
echo.
echo Usage:
echo   ingress-ice.cmd [-r] [-h]
echo.
echo Options:
echo   -r      Edit the configuration
echo   -h      Print this help
echo.
echo Please visit https://ingress.netlify.com/ or http://github.com/nibogd/ingress-ice for more information
:eof
