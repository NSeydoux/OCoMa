#!/bin/bash

#nginx -s quit
nginx -c `pwd`/conf/nginx.conf
mvn clean jetty:run > `pwd`/log/jetty.log
