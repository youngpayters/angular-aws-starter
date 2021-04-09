import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import { WebsiteStack } from "../lib/website-stack";

test("Website Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new WebsiteStack(app, "MyTestWebsiteStack", {
    websiteDomain: "example.com",
    siteSubDomain: "test",
  });
  // THEN
  expectCDK(stack).to(haveResource("AWS::S3::Bucket"));
  expectCDK(stack).to(haveResource("AWS::CloudFront::Distribution"));
});
