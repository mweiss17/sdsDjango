#!/bin/sh
filename=/home/ec2-user/sds/sds/config.json 
sed -i 's/preprod.cdadlb7rfieo.us-east-1.rds.amazonaws.com/sdslivejan28.cdadlb7rfieo.us-east-1.rds.amazonaws.com/g' $filename