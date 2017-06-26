variable "name" {
  description = "Name of Lambda function"
}

variable "artifacts_dir" {
  description = "Path to folder containing Lambda function's artifacts. Directory contents will be zipped."
}

variable "log_retention" {
  description = "Specifies the number of days to retain log events"
  default = 90
}

variable "runtime" {
  description = "Runtime environment for the Lambda function. See: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime."
}

variable "handler" {
  description = "The function that Lambda calls to begin execution"
}

variable "description" {
  description = "Description of what the Lambda Function does"
  default = ""
}

variable "memory_size" {
  description = "Amount of memory in MB the Lambda Function can use at runtime"
  default= 128
}

variable "timeout" {
  description = "Amount of time in seconds the Lambda Function has to run"
  default = 60
}

variable "environment_variables" {
  description = "A map that defines environment variables for the Lambda function"
  type = "map"
}

