RGI Assessment Tool
===================
[![Run Status](https://api.shippable.com/projects/55159b755ab6cc1352ad63c5/badge?branch=master)](https://app.shippable.com/projects/55159b755ab6cc1352ad63c5)
[![Coverage Badge](https://api.shippable.com/projects/55159b755ab6cc1352ad63c5/coverageBadge?branch=master)](https://app.shippable.com/projects/55159b755ab6cc1352ad63c5)
[![Dependancy Badge](https://david-dm.org/nrgi/rgi-assessment-tool.svg)](https://david-dm.org/nrgi/rgi-assessment-tool.svg)

##Summary
***
This tool is a custom webapp build on Node.js, Express and Angular. It is connected on the back-end to to a MongoDB instance.

The tool allows researchers to complete RGI assessments, reviewers to review assessments and administrators to validate and authorize assessments.


##Installation
***
***Method 1:*** Open terminal and run the following commands:

		git clone 
		cd 


***Method 2:***  Install docker. From commande line run:
	
		docker pull byndcivilization/rgi-assessment-tool
		docker run byndcivilization/rgi-assessment-tool -e "USER_ID=<db user name>"" -e "USER_KEY=<db pass>""

		docker run -d=true -p 49160:3030 -e "USER_ID=<db user name>" -e "USER_KEY=<db pass>" byndcivilization/rgi-assessment-tool

##Tests

###Unit Tests
####Client
```
$ karma start
```
####Server
```
$ grunt test:server
```

###E2E Tests
####Install
```
$ npm run-script webdriver-manager-update
```

####Run
```
$ grunt test-server
$ NODE_ENV=test node server.js
```
```
$ grunt test:e2e
```

##TODO
***
-	country of residence no address
-	validation is for admin - make its own page
-	submit always goes to admin
-	email passwords and submit
-	file uplaoad
 
