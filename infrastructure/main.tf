terraform {
  backend "s3" {
    encrypt = "true"
  }
}

provider "aws" {
  region  = "${var.region}"
  version = "~> 1.0"
}

resource "aws_iam_role" "codebuild_role" {
  name = "${var.name}-codebuild"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

data "template_file" "codebuild_policy" {
  template = "${file("./codebuild-role-policy.tpl")}"

  vars {
    kms_key_arns       = "${var.kms_key_arns}"
    ssm_parameter_arns = "${var.ssm_parameter_arns}"
  }
}

resource "aws_iam_role_policy" "codebuild_policy" {
  name   = "${var.name}-codebuild-policy"
  role   = "${aws_iam_role.codebuild_role.id}"
  policy = "${data.template_file.codebuild_policy.rendered}"
}

module "codebuild_project" {
  source = "github.com/jch254/terraform-modules//codebuild-project?ref=1.0.1"

  name               = "${var.name}"
  codebuild_role_arn = "${aws_iam_role.codebuild_role.arn}"
  build_docker_image = "${var.build_docker_image}"
  build_docker_tag   = "${var.build_docker_tag}"
  source_type        = "${var.source_type}"
  buildspec          = "${var.buildspec}"
  source_location    = "${var.source_location}"
}

resource "aws_codebuild_webhook" "codebuild_webhook" {
  project_name  = "${var.name}"
  branch_filter = "master"
}

resource "aws_iam_role" "role" {
  name = "${var.name}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "policy" {
  name = "${var.name}"
  role = "${aws_iam_role.role.name}"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Resource": "*",
      "Action": [
        "logs:*"
      ]
    }
  ]
}
POLICY
}

module "lambda_function" {
  source = "github.com/jch254/terraform-modules//lambda-function?ref=1.0.1"

  name                  = "${var.name}"
  artifacts_dir         = "${var.artifacts_dir}"
  runtime               = "${var.runtime}"
  handler               = "${var.handler}"
  role_arn              = "${aws_iam_role.role.arn}"
  environment_variables = "${var.environment_variables}"
}
