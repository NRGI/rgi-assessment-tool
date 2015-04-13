NAME=byndcivilization/rgi-assessment-tool
VERSION=`git describe`
CORE_VERSION=HEAD

# all: prepare build

build:
	docker build -t $(NAME):$(VERSION) --rm .

tag_latest:
    docker tag $(NAME):$(VERSION) $(NAME):latest

push:
    docker push $(NAME):$(VERSION)