import {
  Stack,
  Construct,
  StackProps,
  RemovalPolicy,
  SizeRoundingBehavior,
  Duration,
} from "@aws-cdk/core";
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb";
import { Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import {
  UserPoolIdentityProvider,
  UserPoolIdentityProviderBase,
  UserPool,
  VerificationEmailStyle,
  AccountRecovery,
  UserPoolClientIdentityProvider,
  UserPoolIdentityProviderAmazon,
} from "@aws-cdk/aws-cognito";

export class ShallwecookApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, "recipes", {
      tableName: "recipesTable",
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

    const userPool = new UserPool(this, "shallwecook-userpool", {
      userPoolName: "shallwecook-userpool",
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Verify your email for ShallWeCook!",
        emailBody:
          "Hello {username}, Thanks for signing up to ShallWeCook! Your verification code is {####}",
        emailStyle: VerificationEmailStyle.CODE,
      },
      signInAliases: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireSymbols: true,
        requireUppercase: true,
        tempPasswordValidity: Duration.days(3),
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
    });

    const client = userPool.addClient("shallwecook", {
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
    });

    const clientId = client.userPoolClientId;

    userPool.addDomain("ShallWeCookDomain", {
      cognitoDomain: {
        domainPrefix: "shallwecook",
      },
    });
  }
}
