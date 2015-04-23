FROM	centos:centos6

# Enable EPEL for Node.js
RUN		rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install Node.js, npm, git and bower
RUN		yum install -y npm
RUN		npm install -g bower
RUN		yum install -y git

# Build src
RUN		git clone -b bug-docker-refinement https://github.com/NRGI/rgi-assessment-tool /src



# Install APP
# RUN		npm cache clean
RUN		cd /src && npm install --production
RUN		cd /src && bower install --allow-root

EXPOSE  80

CMD		["node", "/src/server.js"]