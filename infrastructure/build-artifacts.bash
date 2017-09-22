#!/bin/bash -ex

echo Building artifacts...

yarn run build
yarn install --production --modules-folder dist/node_modules

echo Finished building artifacts
