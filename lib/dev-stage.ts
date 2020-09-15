import { Stage, Construct, StageProps } from "@aws-cdk/core";
import { ShallwecookApiStack } from "./shallwecook-api-stack";

export class Dev extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const database = new ShallwecookApiStack(this, "database");
  }
}
