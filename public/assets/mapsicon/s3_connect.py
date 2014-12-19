#!/usr/bin/python

import boto
import boto.s3
from boto.s3.connection import S3Connection
from boto.s3.key import Key

import os.path
import sys
import re

bucket_name = 'mapsicon'
# root_dir = './'
# dest_dir = ''
# # params for chunking files
# #max size in bytes before uploading in parts. between 1 and 5 GB recommended
# MAX_SIZE = 20 * 1000 * 1000
# #size of parts when uploading in parts
# PART_SIZE = 6 * 1000 * 1000

# connect to s3
# s3 = boto.connect_s3()
s3 = boto.connect_s3('9z)4Q4zNJ%8,)f', 'AKIAIULKY6N4XXELBPYQ,V0M5xZTuE1s1woST2OGFbkZt+Rcbn21mT+FBMjpJ')
bucket = s3.get_bucket(bucket_name)

# def s3LoadFiles():
# 	# target bucket
# 	bucket_name = 'providing-for-peacekeeping-docs'

# 	# source directory
# 	root_dir = '../ppp_files/'

# 	dest_dir = ''

# 	# params for chunking files
# 	#max size in bytes before uploading in parts. between 1 and 5 GB recommended
# 	MAX_SIZE = 20 * 1000 * 1000
# 	#size of parts when uploading in parts
# 	PART_SIZE = 6 * 1000 * 1000

# 	# connect to s3
# 	s3 = boto.connect_s3()

# 	# connect to bukcet
# 	bucket = s3.get_bucket(bucket_name)

# 	# walk the source directory tree and extract file path
# 	upload_file_names = []
	
# 	for (source_dir, dir_list, file_list) in os.walk(root_dir):
# 		for file_name in file_list:
# 			if file_name == '.DS_Store':
# 				pass
# 			elif source_dir == '../ppp_files/':
# 				upload_file_names.append(file_name)
# 			else:
# 				target = source_dir + '/' + file_name
# 				match = re.match("../ppp_files/(.+)", target)
# 				upload_file_names.append(match.groups()[0])


# 	def percent_cb(complete, total):
# 	    sys.stdout.write('.')
# 	    sys.stdout.flush()

# 	for file_name in upload_file_names:
# 	    sourcepath = os.path.join(root_dir + file_name)
	    
# 	    destpath = os.path.join(dest_dir, file_name)
	    
# 	    print 'Uploading %s to Amazon S3 bucket %s' % \
# 	           (sourcepath, bucket_name)
	 
# 	    filesize = os.path.getsize(sourcepath)
# 	    if filesize > MAX_SIZE:
# 	        print "multipart upload"
# 	        mp = bucket.initiate_multipart_upload(destpath)
# 	        fp = open(sourcepath,'rb')
# 	        fp_num = 0
# 	        while (fp.tell() < filesize):
# 	            fp_num += 1
# 	            print "uploading part %i" %fp_num
# 	            mp.upload_part_from_file(fp, fp_num, cb=percent_cb, num_cb=10, size=PART_SIZE)
	 
# 	        mp.complete_upload()
	 
# 	    else:
# 	        print "singlepart upload"
# 	        k = boto.s3.key.Key(bucket)
# 	        k.key = destpath
# 	        k.set_contents_from_filename(sourcepath,
# 	                cb=percent_cb, num_cb=10)