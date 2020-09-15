import { Stack, Construct, StackProps, SecretValue, Aws } from "@aws-cdk/core";
import { Artifact } from "@aws-cdk/aws-codepipeline";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { GitHubSourceAction } from "@aws-cdk/aws-codepipeline-actions";
import { Dev } from "./dev-stage";

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new Artifact();
    const cloudAssemblyArtifact = new Artifact();

    const pipeline = new CdkPipeline(this, "pipeline", {
      pipelineName: "ShallWeCookAPIPipeline",
      cloudAssemblyArtifact,

      sourceAction: new GitHubSourceAction({
        actionName: "GitHub",
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager("github-token"),
        owner: "ehelbig1",
        repo: "shallwecook-api",
      }),

      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
      }),
    });

    pipeline.addApplicationStage(
      new Dev(this, "dev", {
        env: { account: Aws.ACCOUNT_ID, region: Aws.REGION },
      })
    );
  }
}
