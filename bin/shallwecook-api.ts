#!/usr/bin/env node
import "source-map-support/register";
import { App, Aws } from "@aws-cdk/core";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new App();

new PipelineStack(app, "ShallwecookApiStack", {
  env: { account: Aws.ACCOUNT_ID, region: Aws.REGION },
});

app.synth();
