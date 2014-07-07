#!/bin/bash

#Author: Christopher Schirner https://github.com/schinken . Script is taken from a project like this: https://github.com/schinken/ingress-screenshot
export TMP_DIRECTORY="sorted"
VIDEO_FNAME="output.mp4"
VIDEO_FPS=24

echo "Removing existing $TMP_DIRECTORY"
rm -rf $TMP_DIRECTORY

echo "Creating $TMP_DIRECTORY"
mkdir $TMP_DIRECTORY

echo "Copying all ingr- files to $TMP_DIRECTORY"
ls Ice*.png | gawk 'BEGIN{ a=1 }{ printf "ln -s ../%s ${TMP_DIRECTORY}/Ice%04d.png\n", $0, a++ }' | bash

cd $TMP_DIRECTORY

avconv -r 1 -f image2 -i Ice%04d.png -c:v libx264 -maxrate:v 20000k -minrate:v 16000k -c:a n -s 1280x720 -r $VIDEO_FPS $VIDEO_FNAME

