#!/bin/bash

nginx -s quit
nginx -c ./conf/nginx.conf
mvn clean jetty:run > ./log/jetty.log
