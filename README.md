# angular-aws-starter

This is a starter monorepo that allows you to build & deploy a angular single page application (SPA).

# CI/CD Setup

I have added [CircleCI](https://circleci.com/) as a means for deploying. You will need to setup a [context](https://circleci.com/docs/2.0/contexts/?section=pipelines) with the following env variables:

```
// Docker hub credentials
DOCKERHUB_USER
DOCKERHUB_PASSWORD

// AWS credentials
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```