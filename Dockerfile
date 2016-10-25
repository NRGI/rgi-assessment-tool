FROM	centos:centos7
MAINTAINER Chris Perry, cperry@resourcegovernance.org

# Enable EPEL for Node.js
RUN     rpm -Uvh https://rpm.nodesource.com/pub_4.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm

# Upgrade system
RUN     yum -y clean all
RUN     yum -y distro-sync
RUN     yum -y update
RUN     yum -y upgrade

# Install Node.js, npm, and git
RUN     yum install -y git nodejs npm

# Install dependancies
RUN     yum install -y bzip2 fontconfig freetype libfontconfig.so.1 libfreetype.so.6 libstdc++.so.6 tar.x86_64 urw-fonts wget
RUN		npm install -g bower forever grunt

# Build src
ADD     package.json /tmp/package.json
RUN     cd /tmp && npm install
RUN     mkdir -p /src && cp -a /tmp/node_modules /src
ADD     Gruntfile.js /tmp/Gruntfile.js
ADD     server/config/config.js /tmp/server/config/config.js
ADD     public /tmp/public
ADD     .bowerrc /tmp/.bowerrc
ADD     bower.json /tmp/bower.json
RUN		cd /tmp && bower install --allow-root
RUN		cd /tmp && grunt build
RUN		rm -R /tmp/node_modules
COPY	. /src
RUN     cp -a /tmp/public/assets /src/public/assets
RUN		rm -R /tmp/public

RUN     node -v
RUN     npm -v

EXPOSE  80

CMD     ["/src/node_modules/forever/bin/forever","/src/server.js"]