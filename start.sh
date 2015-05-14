#!/bin/sh

# ingress-ice start script by Nikitakun (http://github.com/nibogd/ingress-ice)
#               SETTINGS          
L=''            #google login or email
P=''            #google password
AREA='https://www.ingress.com/intel?ll=35.682398,139.693909&z=11' #link to your location
MINLEVEL='1'    #minimal portal level, set to 1 to display all available portals
MAXLEVEL='8'    #highest portal level, set to 8 to display all
V='120'          #Delay between capturing screenshots in seconds
WIDTH='900'     #Picture width
HEIGHT='500'    #Picture height
FOLDER='./'     #Folder where to save screenshots with \ (or /) in the end. '.' means current folder. 
NUMBER='0'      #Number of screenshots to take. 0 for infinity.
LOGLEVEL='3'    #Log level. 0 = silence, 1 = only short welcome, two-factor code and errors, 2 = everything from 1 + every screenshot announced, 3 = beautiful welcome + everything from 2, 4 = all logs including debug messages, short welcome
#DO NOT EDIT ANYTHING BELOW THIS LINE
ARGS="$L $P $AREA $MINLEVEL $MAXLEVEL $V $WIDTH $HEIGHT $FOLDER $NUMBER $LOGLEVEL"
for arg
do
    if [ "$arg" = --help ]
    then
       echo "Please visit http://github.com/nibogd/ingress-ice for help"
    fi
done

exec ./phantomjs ice.js $ARGS
