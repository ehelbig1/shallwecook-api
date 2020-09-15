import { Stack, Construct, StackProps, RemovalPolicy } from "@aws-cdk/core";
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb";

export class ShallwecookApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, "recipes", {
      tableName: "recipes",
      partitionKey: { name: "category", type: AttributeType.STRING },
      sortKey: { name: "diet", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
