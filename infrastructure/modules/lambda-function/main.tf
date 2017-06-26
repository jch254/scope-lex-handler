data "archive_file" "artifacts" {
  type = "zip"
  source_dir = "${var.artifacts_dir}"
  output_path = "${var.artifacts_dir}/../artifacts.zip"
}

resource "aws_s3_bucket" "deployment" {
  bucket = "${var.name}-deployment"
  acl = "private"
}

resource "aws_s3_bucket_object" "artifacts" {
  bucket = "${aws_s3_bucket.deployment.bucket}"
  key = "${var.name}"
  source = "${var.artifacts_dir}/../artifacts.zip"
  etag = "${data.archive_file.artifacts.output_md5}"
}

resource "aws_cloudwatch_log_group" "lambda_lg" {
  name = "/aws/lambda/${var.name}"
  retention_in_days = "${var.log_retention}"
}

resource "aws_iam_role" "lambda_role" {
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
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.name}-logs"
  role = "${aws_iam_role.lambda_role.name}"

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

resource "aws_lambda_function" "function" { 
  function_name = "${var.name}"
  s3_bucket = "${aws_s3_bucket.deployment.id}"
  s3_key = "${aws_s3_bucket_object.artifacts.id}"
  runtime = "${var.runtime}"
  role = "${aws_iam_role.lambda_role.arn}"
  handler = "${var.handler}"
  source_code_hash = "${data.archive_file.artifacts.output_base64sha256}"
  description = "${var.description}"
  memory_size = "${var.memory_size}"
  timeout = "${var.timeout}"

  environment = {
    variables = "${var.environment_variables}"
  }
}

