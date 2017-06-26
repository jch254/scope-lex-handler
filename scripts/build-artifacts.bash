#!/bin/bash -ex

echo Building artifacts...

export NODE_ENV=production
yarn run build
yarn install --production --modules-folder dist/node_modules

echo Finished building artifacts
