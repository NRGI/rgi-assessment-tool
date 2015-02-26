RGI Assessment Tool
===================
updated
#####Summary
***
This tool is a custom webapp build on Node.js, Express and Angular. It is connected on the back-end to to a MongoDB instance.

The tool allows researchers to complete RGI assessments, reviewers to review assessments and administrators to validate and authorize assessments.


#####Installation
***
***Method 1:*** Open terminal and run the following commands:

		git clone 
		cd 


***Method 2:***  Install docker. From commande line run:
	
		docker pull byndcivilization/rgi-assessment-tool
		docker run byndcivilization/rgi-assessment-tool -e "USER_ID=<db user name>"" -e "USER_KEY=<db pass>""

		docker run -d=true -p 49160:3030 -e "USER_ID=<db user name>" -e "USER_KEY=<db pass>" byndcivilization/rgi-assessment-tool

#####TODO
***
-	country of residence no address
-	validation is for admin - make its own page
-	submit always goes to admin
-	email passwords and submit
-	file uplaoad
 



 var MONGOHQ_URL="mongodb://user:pass@server.compose.io:port_name/db_name"
 mongodb://<user>:<password>@c582.candidate.32.mongolayer.com:10582,c726.candidate.19.mongolayer.com:10726/rgi2015_dev?replicaSet=set-54c2868c4ae1de388800b2a3