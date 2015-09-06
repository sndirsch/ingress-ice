FROM cmfatih/phantomjs

RUN git clone https://github.com/nibogd/ingress-ice.git
ADD start_ingress-ice /
RUN mkdir /screenshots
VOLUME /screenshots
CMD ["/start_ingress-ice"]
