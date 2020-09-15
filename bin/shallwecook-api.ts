#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ShallwecookApiStack } from '../lib/shallwecook-api-stack';

const app = new cdk.App();
new ShallwecookApiStack(app, 'ShallwecookApiStack');
