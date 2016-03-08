FROM	centos:centos6

# Enable EPEL for Node.js
RUN		rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install Node.js, npm, git and bower
RUN		yum install -y git npm wget tar.x86_64 bzip2 fontconfig freetype libfreetype.so.6 libfontconfig.so.1 libstdc++.so.6 urw-fonts
RUN		npm install -g bower

#Install Phantom JS
RUN     wget http://phantomjs.googlecode.com/files/phantomjs-1.8.1-linux-x86_64.tar.bz2 -O /usr/local/share/phantomjs-1.8.1-linux-x86_64.tar.bz2 && ls /usr/local/share
RUN     tar jxvf /usr/local/share/phantomjs-1.8.1-linux-x86_64.tar.bz2 -C /usr/local/share
RUN     ln -s /usr/local/share/phantomjs-1.8.1-linux-x86_64/bin/phantomjs /usr/local/share/phantomjs
RUN     ln -s /usr/local/share/phantomjs-1.8.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs
RUN     ln -s /usr/local/share/phantomjs-1.8.1-linux-x86_64/bin/phantomjs /usr/bin/phantomjs

# Build src
ADD     package.json /tmp/package.json
RUN     cd /tmp && npm install --production
RUN     mkdir -p /src && cp -a /tmp/node_modules /src
RUN		rm -R /tmp/node_modules
COPY	. /src
RUN		cd /src && bower install --allow-root


EXPOSE  80

CMD     ["/src/node_modules/forever/bin/forever","/src/server.js"]
#CMD     ["node", "/src/server.js"]