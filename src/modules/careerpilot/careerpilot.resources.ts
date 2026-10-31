import { ResourceDecorator as Resource, ExecutionContext } from '@nitrostack/core';

export class CareerPilotResources {
  @Resource({
    uri: 'careerpilot://skills-checklist',
    name: 'Skills Checklist',
    description: 'Checklist of in-demand skills by role, used to improve a resume',
    mimeType: 'application/json',
    examples: {
      response: {
        roles: [
          { role: 'Frontend Developer', skills: ['html', 'css', 'javascript', 'react', 'typescript', 'git'] }
        ]
      }
    }
  })
  async getSkillsChecklist(uri: string, ctx: ExecutionContext) {
    ctx.logger.info('Fetching skills checklist');

    const roles = [
      {
        role: 'Frontend Developer',
        skills: ['html', 'css', 'javascript', 'react', 'typescript', 'git'],
        nice_to_have: ['testing', 'accessibility', 'rest api']
      },
      {
        role: 'Backend Developer',
        skills: ['node', 'sql', 'mongodb', 'rest', 'docker', 'git'],
        nice_to_have: ['aws', 'caching', 'authentication']
      },
      {
        role: 'Data Analyst',
        skills: ['python', 'sql', 'data analysis', 'excel', 'communication'],
        nice_to_have: ['power bi', 'statistics', 'storytelling']
      },
      {
        role: 'Machine Learning Engineer',
        skills: ['python', 'machine learning', 'sql', 'git', 'docker'],
        nice_to_have: ['deep learning', 'mlops', 'aws']
      }
    ];

    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify({ roles }, null, 2)
      }]
    };
  }
}
