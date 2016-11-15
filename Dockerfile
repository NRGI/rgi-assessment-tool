FROM	centos:centos7
MAINTAINER Chris Perry, cperry@resourcegovernance.org

# Enable EPEL for Node.js
RUN rpm -Uvh https://rpm.nodesource.com/pub_4.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm

# Install system dependencies
RUN yum install -y \
    git \
    nodejs \
    bzip2 \
    fontconfig \
    freetype \
    libfontconfig.so.1 \
    libfreetype.so.6 \
    libstdc++.so.6 \
    tar.x86_64 \
    urw-fonts \
    wget &&\
    # Cleanup to reduce image size
    yum clean all

RUN	npm install -g bower@1.7.9 forever grunt

# Build src
COPY . /src
WORKDIR /src

RUN npm install && \
    npm cache clear
RUN	bower install --allow-root
RUN grunt build && grunt hash

EXPOSE  80

CMD     ["/src/node_modules/forever/bin/forever","/src/server.js"]
