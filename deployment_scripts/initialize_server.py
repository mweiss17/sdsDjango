#!/bin/sh
filename=/home/ec2-user/sds/sds/settings/__init__.py 
sed -i 's/.preprod/.prod/g' $filename
fab migrate_database

