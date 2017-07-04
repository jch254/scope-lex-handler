#!/bin/bash -ex

echo Deploying infrastructure via Terraform...

cd infrastructure
terraform init \
  -backend-config "bucket=${TF_VAR_remote_state_bucket}" \
  -backend-config "key=${TF_VAR_name}" \
  -backend-config "region=${TF_VAR_remote_state_region}"
terraform get --update
terraform plan
terraform apply
cd ..

echo Finished deploying infrastructure
