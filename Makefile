NAME=byndcivilization/rgi-assessment-tool
VERSION=`git describe`
CORE_VERSION=HEAD

all: prepare build

build:
	docker build -t $(NAME):latest --rm .

push:
    docker push $(NAME):$(VERSION)