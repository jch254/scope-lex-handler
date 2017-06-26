terraform {
  backend "s3" {
    encrypt = "true"
  }
}

provider "aws" {
  region = "${var.region}"
}

module "build_pipeline" {
  source = "./modules/build-pipeline"

  name = "${var.name}"
  kms_key_arns = "${var.kms_key_arns}"
  ssm_parameter_arns = "${var.ssm_parameter_arns}"
  build_docker_image = "${var.build_docker_image}"
  build_docker_tag = "${var.build_docker_tag}"
  github_oauth_token = "${var.github_oauth_token}"
  github_repository_owner = "${var.github_repository_owner}"
  github_repository_name = "${var.github_repository_name}"
  github_branch_name = "${var.github_branch_name}"
}

module "lambda_function" {
  source = "./modules/lambda-function"

  name = "${var.name}"
  artifacts_dir = "${var.artifacts_dir}"
  runtime = "${var.runtime}"
  handler = "${var.handler}"
  environment_variables = "${var.environment_variables}"
}
