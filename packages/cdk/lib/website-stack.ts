import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import { ViewerProtocolPolicy } from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as route53 from "@aws-cdk/aws-route53";
import * as alias from "@aws-cdk/aws-route53-targets";
import * as acm from "@aws-cdk/aws-certificatemanager";

interface WebsiteStackProps extends cdk.StackProps {
  websiteDomain: string;
  siteSubDomain: string;
  acmCertificateArn?: string;
}

export class WebsiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    const { websiteDomain, siteSubDomain } = props;

    const domainName = siteSubDomain + "." + websiteDomain;

    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: domainName,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
    });

    const zone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: websiteDomain,
    });

    const certificate = props.acmCertificateArn
      ? acm.Certificate.fromCertificateArn(
          this,
          "ExistingACMCertificate",
          props.acmCertificateArn
        )
      : new acm.DnsValidatedCertificate(this, "WebsiteDnsACMCert", {
          domainName,
          hostedZone: zone,
          region: "us-east-1", // Cloudfront only checks this region for certificates.
        });

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "/index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
      certificate,
      domainNames: [domainName],
    });

    new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [s3deploy.Source.asset("../../dist/website")],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/assets/*", "/index.html"],
    });

    new route53.ARecord(this, "AliasRecord", {
      zone,
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new alias.CloudFrontTarget(distribution)
      ),
    });
  }
}
