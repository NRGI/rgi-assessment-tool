FROM    centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install Node.js, npm, git and bower
RUN     yum install -y npm
RUN     yum install -y git
RUN		npm install -g bower

# Build src
RUN git clone https://github.com/NRGI/rgi-assessment-tool /rgi-assessment-tool
RUN cd /rgi-assessment-tool && npm install
RUN cd /rgi-assessment-tool && bower install --allow-root

ENV USER_ID='cperry'
ENV USER_KEY='50Crat3s'

EXPOSE  3030
EXPOSE  80

CMD ["node", "/rgi-assessment-tool/server.js"]