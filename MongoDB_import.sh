#!/bin/sh
ls -1 *.json | sed 's/.json$//' | while read col; do 
    mongoimport --jsonArray --db wikipedia --collection revisions < $col.json; 
done