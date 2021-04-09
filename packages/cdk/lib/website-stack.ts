import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as route53 from "@aws-cdk/aws-route53";
import * as alias from "@aws-cdk/aws-route53-targets";
import * as acm from "@aws-cdk/aws-certificatemanager";

interface WebsiteStackProps extends cdk.StackProps {
  webiteDomain: string;
  acmCertificateArn?: string;
  domainNames?: Array<string>;
}

export class WebsiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    const { domainNames, webiteDomain } = props;
    // The code that defines your stack goes here
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
    });

    if (props.acmCertificateArn) {
      domainNames?.push(webiteDomain);
    }

    const certificate = props.acmCertificateArn
      ? acm.Certificate.fromCertificateArn(
          this,
          "CloudfrontCertificate",
          props.acmCertificateArn
        )
      : undefined;

    // Handles buckets whether or not they are configured for website hosting.
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: { origin: new origins.S3Origin(websiteBucket) },
      certificate,
      domainNames,
    });

    new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [s3deploy.Source.asset("../../dist/website")],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/assets/*", "/index.html"],
    });

    const zone = new route53.PublicHostedZone(this, "HostedZone", {
      zoneName: props.webiteDomain,
    });

    if (zone && zone.hostedZoneId) {
      new route53.ARecord(this, "AliasRecord", {
        zone,
        target: route53.RecordTarget.fromAlias(
          new alias.CloudFrontTarget(distribution)
        ),
      });
    }
  }
}
