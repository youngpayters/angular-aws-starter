# angular-aws-starter

This is a starter monorepo that allows you to build & deploy a angular single page application (SPA).

# Pre-requisites

In order to succssfully deploy website to a domain, you will need to have a Hosted zone created on Route53 before you can proceed.

You can create this on the [AWS console here](https://console.aws.amazon.com/route53/v2/hostedzones#CreateHostedZone)
# CI/CD Setup

I have added [CircleCI](https://circleci.com/) as a means for deploying. 

You will need to setup a [context](https://circleci.com/docs/2.0/contexts/?section=pipelines) with the following env variables:

```
// Docker hub credentials
DOCKERHUB_USER
DOCKERHUB_PASSWORD

// AWS credentials
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION 
```

# Local Deployment

## Environment variables

There are a number of environment variables that are required in order to successfully deploy the website to AWS. 

These are the following:

* `CDK_DEFAULT_REGION` - Since cdk is checking for an existing do
*