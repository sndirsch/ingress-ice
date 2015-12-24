FROM base/archlinux

# Based on Dockerfile by pheanex
# Usage:
# $ docker build -t ingress-ice .
# $ docker run -d -v /path/to/.ingress-ice.conf:/.ingress-ice.conf -v /path/to/screenshots/:/screenshots ingress-ice
MAINTAINER Nikitakun <linuxoid.x64@gmail.com>

RUN pacman-key --populate archlinux
RUN pacman-key --refresh-keys
RUN pacman -Sy phantomjs ttf-droid --noconfirm
ADD . /ingress-ice/
RUN chmod +x /ingress-ice/docker-ingress-ice.sh
RUN mkdir /screenshots
VOLUME /screenshots
CMD ["/ingress-ice/docker-ingress-ice.sh"]
