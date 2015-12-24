#!/bin/bash

config_file="/.ingress-ice.conf"
screenshot_folder="/screenshots/"
if ! [[ -r "$config_file" ]]
then
	echo "The configuration file does not exists. Please create it first and then specify it as a docker volume!" >&2
	exit 1
fi

umask 0000

cd /screenshots
phantomjs /ingress-ice/ice/ice.js /.ingress-ice.conf > ingress-ice.log
