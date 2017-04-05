#!/bin/bash

# ingress-ice start script by Nikitakun
# Launch this script from console ( $ chmod +x ingress-ice&&./ingress-ice )
FILE="$HOME/.ingress-ice.conf"

SCRIPT_HOME=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
COUNT=""
MACHINE_TYPE=`uname -m`

PHANTOMJS="$SCRIPT_HOME/phantomjs"
PHANTOMJS_FLAGS="--ignore-ssl-errors=true"

if (command -v dialog >/dev/null)
then
  DIALOG=${DIALOG=dialog}
else
  if (command -v whiptail >/dev/null)
  then
    DIALOG=${DIALOG=whiptail}
  else
    TEXT=true
  fi
fi

launch() {
  if [ -f "$1" ]
  then
    clear
    if [ "$2" = "0" ]; then
      echo "Existing config file found ($1). Starting ice..."
    else
      echo "Existing config file found ($1). Starting ice... (Take $2 screenshots)"
    fi
    if (command -v notify-send >/dev/null)
    then
      notify-send "Ingress Ice" "ICE is running"
    fi
    ARGS="$1 $2"
    if [ ! $LOOP ]
    then
      $PHANTOMJS $PHANTOMJS_FLAGS "$SCRIPT_HOME/ice/ice.js" $ARGS; exit;
    else
      while :; do
        $PHANTOMJS $PHANTOMJS_FLAGS "$SCRIPT_HOME/ice/ice.js" $ARGS
      done
    fi
  else
    if [ ! $TEXT ]; then
      $DIALOG --backtitle "Automatic screenshooter for ingress intel map" --title "Ingress Ice" --clear \
        --yesno "Config file for Ice not found. Create one?" 8 36
      case $? in
        0) user_input $1 $2; break;;
        1) clear
           echo "Config file is mandatory. Exiting..."
           exit;;
        255) clear; exit;;
      esac
    else
      while true; do
        echo "Ingress ICE, Automatic screenshooter for ingress intel map"
        read -p "Config file not found ($1). Create one? (y/n) " yn
        case $yn in
          [Yy]* ) user_input $1 $2; break;;
	  [Nn]* ) clear;echo "Config file is mandatory. Exiting..."; exit;;
              * ) echo "Please answer y(es) or n(o).";;
        esac
      done
    fi
  fi
}

echo_help() {
  echo "Ingress ICE"
  echo ""
  echo "Usage:"
  echo "  ingress-ice.sh [-c 100] [-i settings.txt] [-r]"
  echo "  ingress-ice.sh -h | -?"
  echo "  ingress-ice.sh -a"
  echo ""
  echo "Options:"
  echo "  -h -?        Show this help"
  echo "  -r           Edit your configuration"
  echo "  -a           Show authors"
  echo "  -c <count>   Take <count> screenshots"
  echo "  -i <file>    Read settings from <file> or create config if not exists"
  echo "  -o           Delete old config and configure ice from scratch"
  echo "  -s           Run Ingress ICE in an endless loop (it will restart automatically after an error)"
  echo ""
  echo "Please visit https://ingress.netlify.com/ or http://github.com/nibogd/ingress-ice for more information"
  exit;
}

user_input() {
  if [ ! -f "$1" ]; then
    cp "$SCRIPT_HOME/ice/ingress-ice.conf.sample" $1
  fi
  if [ ! $TEXT ]; then
    $DIALOG --title "Notice" --msgbox "I've created a sample config for you. You will be redirected to a text editor.\nEnter your settings there (don't forget to save it!) and close the editor.\n\nIce will start automatically." 12 50;
    if [ -z "$EDITOR" ] || [ "x$EDITOR" == "x" ]
    then
      nano $1
    else
      $EDITOR $1
    fi
    launch $1 $2
  else
    echo "I've created a sample config for you. You will be redirected to a text editor (\$EDITOR or nano). Enter your settings there (don't forget to save it!) and close the editor. Ice will start automatically."
    if [ -z "$EDITOR" ]
    then
      nano $1
    else
      $EDITOR $1
    fi
    launch $1 $2
  fi
}

OPTIND=1
NFILE=""
COUNT=""

while getopts "h?rolsc:ai:" opt; do
    case "$opt" in
    	h|\?)  echo_help;;
    	i)     NFILE=$OPTARG;;
	    a)     if [ ! $TEXT ]; then
               $DIALOG --title "Credits" --msgbox "Ingress ICE (Distributed under the MIT License)\n\nAuthors:\n  Nikitakun (http://github.com/nibogd) @ni_bogd\n\nContributors:\n(See https://github.com/nibogd/ingress-ice/graphs/contributors)" 16 52;exit;
             else
               echo "Ingress ICE (Distributed under the MIT License)"
               echo ""
               echo "Authors:"
               echo "  Nikitakun (http://github.com/nibogd)"
               echo ""
               echo "Contributors:"
               echo "(See the full list here: https://github.com/nibogd/ingress-ice/graphs/contributors)"
               exit;
             fi;;
      o)     if [ -z "$NFILE" ]; then
               NFILE=$FILE
             fi
             rm $NFILE
             if [ -z "$COUNT" ]; then
               COUNT=0
             fi
             user_input $NFILE $COUNT; break;;
	    c)     COUNT=$OPTARG;;
	    l)     TEXT=true;;
    	r)     if [ -z "$NFILE" ]; then
               NFILE=$FILE
             fi
             if [ -z "$COUNT" ]; then
               COUNT=0
             fi
             user_input $NFILE $COUNT; break;;
      s)     LOOP=true;;
    esac
done

shift $((OPTIND-1))

[ "$1" = "--" ] && shift

if [ -z "$NFILE" ]; then
  NFILE=$FILE
fi

if [ -z "$COUNT" ]; then
  COUNT=0
fi

launch $NFILE $COUNT
