import { PromptDecorator as Prompt, ExecutionContext } from '@nitrostack/core';

export class CareerPilotPrompts {
  @Prompt({
    name: 'interview_coach',
    description: 'Practice interview questions for a role, using the candidate missing skills',
    arguments: [
      {
        name: 'role',
        description: 'The role to practice for, for example Frontend Developer',
        required: true
      },
      {
        name: 'missing_skills',
        description: 'Skills missing from the resume, separated by commas (optional)',
        required: false
      }
    ]
  })
  async interviewCoach(args: any, ctx: ExecutionContext) {
    ctx.logger.info('Generating interview coach prompt', { role: args.role });

    const role = args.role || 'Software Developer';
    const missing = args.missing_skills
      ? `The candidate is weak in: ${args.missing_skills}. Ask at least two questions about these areas.`
      : 'Ask a balanced mix of technical and behavioural questions.';

    return [
      {
        role: 'user' as const,
        content: `Act as an interview coach. I am preparing for a ${role} interview. ${missing} Ask me one question at a time, wait for my answer, then give short feedback and a score out of 10. After 5 questions, give a final summary with my top strength and top thing to improve.`
      },
      {
        role: 'assistant' as const,
        content: `Great, let us practise for the ${role} interview. I will ask one question at a time and give feedback after each answer. Here is question 1: Tell me about a project you built and the part you are most proud of.`
      }
    ];
  }
}
