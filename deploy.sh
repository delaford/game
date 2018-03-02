#!/bin/bash

echo "Starting deployment..."

pm2 stop all

yarn build

pm2 start all
