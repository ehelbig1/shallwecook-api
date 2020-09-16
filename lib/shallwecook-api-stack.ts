import {
  Stack,
  Construct,
  StackProps,
  RemovalPolicy,
  SizeRoundingBehavior,
} from "@aws-cdk/core";
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb";

export class ShallwecookApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, "recipes", {
      tableName: "recipes",
      partitionKey: { name: "category", type: AttributeType.STRING },
      sortKey: { name: "id", type: AttributeType.NUMBER },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    table.addLocalSecondaryIndex({
      indexName: "category-name-index",
      sortKey: { name: "name", type: AttributeType.STRING },
    });

    table.addLocalSecondaryIndex({
      indexName: "category-diet-index",
      sortKey: { name: "diet", type: AttributeType.STRING },
    });

    table.addGlobalSecondaryIndex({
      indexName: "diet-ingredients-index",
      partitionKey: { name: "diet", type: AttributeType.STRING },
    });

    table.addGlobalSecondaryIndex({
      indexName: "diet-allergen-index",
      partitionKey: { name: "diet", type: AttributeType.STRING },
      sortKey: { name: "allergen", type: AttributeType.STRING },
    });
  }
}
