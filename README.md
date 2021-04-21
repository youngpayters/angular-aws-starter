# Angular Application Starter Template

This is a starter monorepo that allows you to build & deploy a angular single page application (SPA) on S3 with cloudfront CDN enabled.

This should be a great jumping off point for easily building and deploying angular applications onto the cloud with relative ease.

The reasoning behind this template project was that I would spend about 2 days creating this very same setup each time I would create an application.

So if there was a nice approach to wiring all this up with the CI/CD in mind, then I would have a great starter project with all that configuration gone, and start to focus on the website and functionality rather than the plumbing.

Also since this has CI/CD in mind, the headaches of deployment and maintainance are greatly reduced.

# Pre-requisites

In order to succssfully deploy website to a domain, you will need to have a Hosted zone created on Route53 before you can proceed.

You can create this on the [AWS console here](https://console.aws.amazon.com/route53/v2/hostedzones#CreateHostedZone)

# CI/CD Setup

I have added [CircleCI](https://circleci.com/) as a means for deploying. 

You will need to setup a [context](https://circleci.com/docs/2.0/contexts/?section=pipelines) with the following env variables, subdivided below but all should be part of the context or project level env variables.

The CI/CD workflow is still in an early phase of development so would like to add a staging/production style approach to deployment that would allow for testing before deploying to production to reduce the risk of breaking changes.

Any feedback on this approach would be greatly appreciated!

## Docker Hub Environment variables

* DOCKERHUB_USER
* DOCKERHUB_PASSWORD

## AWS Credentials Environment variables

* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* AWS_REGION 

## CDK Stack Environment variables

There are a number of environment variables that are required in order to successfully deploy the website to AWS. 

These are the following:

* `CDK_DEFAULT_REGION` - Since cdk is checking for an existing domain, it's needs to specify the default region as to where the stack will be created
* `CDK_DEFAULT_ACCOUNT` - Due to the same reasons above
* `STACK_NAME` - The cloudformation stack name that is created for this
* `WEBSITE_DOMAIN` - The website domain that you have created in Route53 (e.g example.com)
* `SUB_DOMAIN` - The sub domain that you wish to add to the domain (e.g `www`, `test`, `app` or anything that makes sense in your scenario)

### Using other CI/CD setups

You can easily plug in others in place of CirlceCI (gitlab pipelines/github actions, etc.).

Just be sure to plug in the same environment variables for your pipeline as per the entries above.

# Contributing

Feel free to create MRs with any improvements features as you see fit. Be sure to create issues as well if things that are wrong.