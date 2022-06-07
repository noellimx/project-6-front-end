#!/bin/bash

# rm -rf node_modules
# rm package-lock.json
# npm i 


npm run db:drop
npm run db:create
psql -d p4 -f ./dev.sql
npm run db:migrate
