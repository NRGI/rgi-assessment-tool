NAME=byndcivilization/rgi-assessment-tool
VERSION=`git describe`
CORE_VERSION=HEAD

all: prepare build

prepare:
	git archive -o rgi-assessment-tool.tar HEAD

build:
	docker build -t $(NAME):$(VERSION) --rm .

tag_latest: 
	docker tag $(NAME):$(VERSION) $(NAME):latest

push:
	docker push $(NAME):$VERSION
	docker build -t $(NAME) .
	docker push $(NAME):latest