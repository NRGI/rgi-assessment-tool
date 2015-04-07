NAME=byndcivilization/rgi-assessment-tool
VERSION=`git describe`
CORE_VERSION=HEAD

all: prepare build

prepare:
	git archive -o rgi-assessment-tool.tar HEAD

build:
<<<<<<< HEAD
	docker build -t $(NAME):$(VERSION) --rm .

tag_latest: 
	docker tag $(NAME):$(VERSION) $(NAME):latest

push:
	docker push $(NAME):$VERSION
=======
	docker build -t $(NAME) .

tag_latest: 
	docker tag $(NAME) $(NAME):latest

push:
	docker push $(NAME):latest
>>>>>>> 2667c1fc15d08578e75d9fe6e5a3d037e9379c96
