import { ToolDecorator as Tool, Widget, ExecutionContext, z } from '@nitrostack/core';

// Mock skill list used to match a resume against a job description
const KNOWN_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'react', 'node', 'sql',
  'mongodb', 'html', 'css', 'git', 'docker', 'aws', 'rest', 'api',
  'machine learning', 'data analysis', 'communication', 'teamwork'
];

type Application = {
  id: number;
  company: string;
  role: string;
  status: string;
  notes: string;
  added_on: string;
};

// In-memory storage (mock data, resets when the server restarts)
const applications: Application[] = [
  {
    id: 1,
    company: 'Infosys',
    role: 'Software Engineer Trainee',
    status: 'applied',
    notes: 'Applied through campus portal',
    added_on: '2026-10-28'
  },
  {
    id: 2,
    company: 'Zoho',
    role: 'Frontend Developer',
    status: 'interview',
    notes: 'Round 1 on Monday',
    added_on: '2026-10-29'
  },
  {
    id: 3,
    company: 'Swiggy',
    role: 'Data Analyst Intern',
    status: 'saved',
    notes: '',
    added_on: '2026-10-30'
  }
];
let nextId = 4;

function findSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => lower.includes(skill));
}

export class CareerPilotTools {
  @Tool({
    name: 'analyze_resume',
    description: 'Compare a resume with a job description and return a match score, matched skills and missing skills',
    inputSchema: z.object({
      resume_text: z.string().describe('Full text of the resume'),
      job_title: z.string().describe('Job title being applied for'),
      job_description: z.string().describe('Text of the job description')
    }),
    examples: {
      request: {
        resume_text: 'Skills: JavaScript, React, Git, SQL',
        job_title: 'Frontend Developer',
        job_description: 'Looking for React, TypeScript, CSS and Git skills'
      },
      response: {
        job_title: 'Frontend Developer',
        match_score: 50,
        matched_skills: ['react', 'git'],
        missing_skills: ['typescript', 'css'],
        verdict: 'Fair match',
        tip: 'Add or learn: typescript, css'
      }
    }
  })
  @Widget('match-score')
  async analyzeResume(input: any, ctx: ExecutionContext) {
    ctx.logger.info('Analyzing resume', { job_title: input.job_title });

    const resumeSkills = findSkills(input.resume_text);
    const requiredSkills = findSkills(input.job_description);

    const matched = requiredSkills.filter((s) => resumeSkills.includes(s));
    const missing = requiredSkills.filter((s) => !resumeSkills.includes(s));

    const score = requiredSkills.length === 0
      ? 0
      : Math.round((matched.length / requiredSkills.length) * 100);

    let verdict = 'Weak match';
    if (score >= 75) verdict = 'Strong match';
    else if (score >= 50) verdict = 'Fair match';

    return {
      job_title: input.job_title,
      match_score: score,
      matched_skills: matched,
      missing_skills: missing,
      verdict,
      tip: missing.length > 0
        ? `Add or learn: ${missing.join(', ')}`
        : 'Your resume covers every skill found in this job description'
    };
  }

  @Tool({
    name: 'add_application',
    description: 'Add a job application to the tracker',
    inputSchema: z.object({
      company: z.string().describe('Company name'),
      role: z.string().describe('Role applied for'),
      status: z.enum(['saved', 'applied', 'interview', 'offer', 'rejected']).describe('Current status of the application'),
      notes: z.string().optional().describe('Optional notes')
    }),
    examples: {
      request: {
        company: 'Google',
        role: 'Frontend Developer',
        status: 'applied'
      },
      response: {
        message: 'Added Frontend Developer at Google',
        total_applications: 4
      }
    }
  })
  async addApplication(input: any, ctx: ExecutionContext) {
    ctx.logger.info('Adding application', { company: input.company, role: input.role });

    // Avoid duplicates: same company and role updates the existing entry
    const existing = applications.find(
      (a) =>
        a.company.toLowerCase() === String(input.company).toLowerCase() &&
        a.role.toLowerCase() === String(input.role).toLowerCase()
    );
    if (existing) {
      existing.status = input.status;
      if (input.notes) existing.notes = input.notes;
      return {
        message: `${existing.role} at ${existing.company} is already in your tracker, status updated to ${existing.status}`,
        application: existing,
        total_applications: applications.length
      };
    }

    const app: Application = {
      id: nextId++,
      company: input.company,
      role: input.role,
      status: input.status,
      notes: input.notes || '',
      added_on: new Date().toISOString().slice(0, 10)
    };
    applications.push(app);

    return {
      message: `Added ${app.role} at ${app.company}`,
      application: app,
      total_applications: applications.length
    };
  }

  @Tool({
    name: 'list_applications',
    description: 'List all tracked job applications as a board, optionally filtered by status',
    inputSchema: z.object({
      status: z.enum(['saved', 'applied', 'interview', 'offer', 'rejected']).optional().describe('Only show applications with this status')
    }),
    examples: {
      request: {},
      response: {
        total: 1,
        applications: [
          {
            id: 1,
            company: 'Infosys',
            role: 'Software Engineer Trainee',
            status: 'applied',
            notes: '',
            added_on: '2026-10-28'
          }
        ]
      }
    }
  })
  @Widget('application-board')
  async listApplications(input: any, ctx: ExecutionContext) {
    ctx.logger.info('Listing applications', { status: input.status });

    const list = input.status
      ? applications.filter((a) => a.status === input.status)
      : applications;

    return {
      total: list.length,
      applications: list
    };
  }
}
