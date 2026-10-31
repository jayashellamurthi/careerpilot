import { Module } from '@nitrostack/core';
import { CareerPilotTools } from './careerpilot.tools.js';
import { CareerPilotResources } from './careerpilot.resources.js';
import { CareerPilotPrompts } from './careerpilot.prompts.js';

@Module({
  name: 'careerpilot',
  description: 'Resume matching and job application tracking',
  controllers: [CareerPilotTools, CareerPilotResources, CareerPilotPrompts]
})
export class CareerPilotModule {}
