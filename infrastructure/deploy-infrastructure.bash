#!/bin/bash -ex

echo Deploying infrastructure via Terraform...

cd infrastructure

export TF_VAR_environment_variables='{SPOTIFY_CLIENT_ID="'$SPOTIFY_CLIENT_ID'",SPOTIFY_CLIENT_SECRET="'$SPOTIFY_CLIENT_SECRET'",GENIUS_ACCESS_TOKEN="'$GENIUS_ACCESS_TOKEN'",PAGE_ACCESS_TOKEN="'$PAGE_ACCESS_TOKEN'"}'

terraform init \
  -backend-config "bucket=${REMOTE_STATE_BUCKET}" \
  -backend-config "key=${TF_VAR_name}" \
  -backend-config "region=${REMOTE_STATE_REGION}" \
  -get=true \
  -upgrade=true
terraform plan -out main.tfplan
terraform apply main.tfplan

cd ..

echo Finished deploying infrastructure
