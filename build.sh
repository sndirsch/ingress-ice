#!/bin/bash
# Ingress ICE buildscript

NRML="$(tput sgr0)"
RED="$(tput setaf 1)"
BLUE="$(tput setaf 4)"
GREEN="$(tput setaf 2)"
DIR="`pwd`"
declare -A platforms=(
["ingress-ice-linux32"]="https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-i686.tar.bz2"
["ingress-ice-linux64"]="https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2"
["ingress-ice-armv6l"]="https://github.com/spfaffly/phantomjs-linux-armv6l/blob/master/phantomjs-2.0.1-development-linux-armv6l.tar.gz?raw=true"
["ingress-ice-osx"]="https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-macosx.zip"
["ingress-ice-win32"]="https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-windows.zip"
)

declare -A cmds=(
["ingress-ice-linux32"]="tar xvjf "
["ingress-ice-linux64"]="tar xvjf "
["ingress-ice-armv6l"]="tar xvzf "
["ingress-ice-osx"]="unzip "
["ingress-ice-win32"]="unzip "
)

declare -A pack=(
["ingress-ice-linux32"]="tar cvzf ingress-ice-linux32.tar.gz --owner=0 --group=0"
["ingress-ice-linux64"]="tar cvzf ingress-ice-linux64.tar.gz --owner=0 --group=0"
["ingress-ice-armv6l"]="tar cvzf ingress-ice-armv6l.tar.gz --owner=0 --group=0"
["ingress-ice-osx"]="zip -r ingress-ice-osx.zip"
["ingress-ice-win32"]="zip -r ingress-ice-win32.zip"
)

declare -A clean=(
["ingress-ice-linux32"]="ingress-ice.cmd reconfigure.cmd"
["ingress-ice-linux64"]="ingress-ice.cmd reconfigure.cmd"
["ingress-ice-armv6l"]="ingress-ice.cmd reconfigure.cmd"
["ingress-ice-osx"]="ingress-ice.cmd reconfigure.cmd"
["ingress-ice-win32"]="ingress-ice.sh"
)

TEMP_DIR="/tmp/ingress-ice"

say_red() {
  echo -e "> $RED$1$NRML"
  exit 1
}

say_blue() {
  echo "> $BLUE$1$NRML"
}

say_green() {
  echo "> $GREEN$1$NRML"
}

quit() {
  echo -e ">$RED Operation cancelled by user.$NRML"

  kill -- -$(ps -o pgid= $pokepid | grep -o '[0-9]*') >/dev/null
  exit 2
}

remove() {
  for i in $@; do
    rm "$i" -rf
    say_green "Deleted $i"
  done
}

trap "quit" 2

[[ -d "$TEMP_DIR" ]] && rm -rf "$TEMP_DIR"
say_blue "Copying everything to a temporary directory..."
mkdir "$TEMP_DIR/original" -p
cp * "$TEMP_DIR/original" -R

say_blue "Removing development-related files..."
cd $TEMP_DIR/original
remove .git .gitattributes .gitignore CONTRIBUTING.md Dockerfile docker-ingress-ice.sh .editorconfig .dockerignore build.sh ingress-ice-* phantom-bin

cd ..

say_blue "Creating directories for different OS..."
for i in ${!platforms[@]}; do
  cp original "$i" -R
  say_green "Created $i"
done

say_blue "Downloading PhantomJS for each OS..."
mkdir phantom-bin && cd phantom-bin

for i in ${!platforms[@]}; do
  [[ ! -d "$i" ]] && mkdir "$i"
  cd "$i"
  wget ${platforms[$i]} -O phntm
  ${cmds[$i]} phntm
  say_green "Downloaded for $i"
  find -regex ".\/phantom.*\/bin\/phantom.*" -exec mv {} "../../$i" \;
  cd ..
done

cd ..

say_blue "Cleaning..."
for i in ${!clean[@]}; do
  if [[ -d "$i" ]]; then
    cd "$i"
    rm -rf ${clean[$i]}
    say_green "Found and removed ${clean[$i]}"
    cd ..
  fi
done

say_blue "Archiving Ingress ICE"
for i in ${!platforms[@]}; do
  ${pack[$i]} "$i"
  say_green "Packed $i"
done

say_blue "Saving your archives..."
mv *.tar.gz $DIR
mv *.zip $DIR
cd $DIR

say_blue "You now have these builds:"
ls -l *.tar.gz *.zip

rm "$TEMP_DIR" -rf
