FROM	centos:centos6

# Enable EPEL for Node.js
RUN		rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install Node.js, npm, git and bower
RUN		yum install -y npm
RUN		npm install -g bower
# RUN		yum install -y git

# Build src
COPY	. /src
# RUN		git clone -b bug-docker-refinement https://github.com/NRGI/rgi-assessment-tool /src

# # Create a nonroot user, and switch to it
# RUN     /usr/sbin/useradd --create-home --home-dir /usr/local/nonroot --shell /bin/bash nonroot
# RUN     /usr/sbin/adduser nonroot sudo
# RUN     chown -R nonroot /usr/local/
# RUN     chown -R nonroot /usr/lib/
# RUN     chown -R nonroot /usr/bin/
# RUN     chown -R nonroot /src

# USER    nonroot


# Install APP
# RUN		npm cache clean
RUN		cd /src && npm install
RUN		cd /src && bower install --allow-root

EXPOSE  80

CMD		["node", "/rgi-assessment-tool/server.js"]