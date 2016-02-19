#!/bin/bash

config_file="/.ingress-ice.conf"
screenshot_folder="/screenshots"
if ! [[ -r "$config_file" ]]
then
        if ! [[ -r "$screenshot_folder$config_file" ]]
        then
                echo "The configuration file does not exists. Please create it first and then specify it as a docker volume or 
put it into screenshots directory as $config_file" >&2
                exit 1
        else
                config_file="$screenshot_folder$config_file"
        fi
fi

umask 0000

cd $screenshot_folder
phantomjs "/ingress-ice/ice/ice.js" "$config_file" > ingress-ice.log
