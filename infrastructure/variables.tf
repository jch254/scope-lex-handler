variable "region" {
  description = "AWS region to deploy to (e.g. us-east-1)"
}

variable "name" {
  description = "Name of project (used in AWS resource names)"
}

variable "kms_key_arns" {
  description = "Array of escaped KMS Key ARNs used to decrypt secrets specified via ssm_parameter_arns variable"
}

variable "ssm_parameter_arns" {
  description = "Array of escaped SSM Parameter ARNs used to set secret build environment variables via SSM Parameter Store"
}

variable "build_docker_image" {
  description = "Docker image to use as build environment"
}

variable "build_docker_tag" {
  description = "Docker image tag to use as build environment"
}

variable "github_oauth_token" {
  description = "OAuth token used to authenticate against CodePipeline source GitHub repository"
}

variable "github_repository_owner" {
  description = "Owner of GitHub repository to use as CodePipeline source"
}

variable "github_repository_name" {
  description = "Name of GitHub repository to use as CodePipeline source"
}

variable "github_branch_name" {
  description = "GitHub repository branch to use as CodePipeline source"
}

variable "artifacts_dir" {
  description = "Path to folder containing Lambda function's artifacts"
}

variable "runtime" {
  description = "Runtime environment for the Lambda function. See: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime."
}

variable "handler" {
  description = "The function that Lambda calls to begin execution"
}

variable "environment_variables" {
  description = "A map that defines environment variables for the Lambda function"
  type = "map"
}
