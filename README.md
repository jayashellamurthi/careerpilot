# CareerPilot

An AI career copilot built as an MCP server with NitroStack. It matches your resume to a job description, shows the skills you are missing, and tracks your job applications on a board, all through a normal conversation with an AI agent.

## The problem

Job hunting in India means juggling many job portals, a resume that never quite fits, and a spreadsheet of applications that is always out of date. Every step happens in a different tab.

## The workflow reimagined

Original product area: online job platforms (for example LinkedIn and Naukri).

Today you open a job post, guess whether your resume fits, then copy details into a tracker by hand. With CareerPilot, you tell the AI agent "compare my resume with this job and save it to my tracker". The agent calls the right tools by itself, shows a match score card, and updates your application board. Without MCP, the agent could not read your tracker or act on it, so MCP is what makes this possible.

## Live demo

- MCP server (NitroCloud): SERVICE_URL_HERE
- NitroChat: CHAT_URL_HERE

## What is inside

| Type | Name | What it does |
|------|------|--------------|
| Tool | `analyze_resume` | Compares resume text with a job description. Returns a match score, matched skills and missing skills. Shows a match score card widget. |
| Tool | `add_application` | Adds a job application with company, role and status (saved, applied, interview, offer, rejected). |
| Tool | `list_applications` | Lists tracked applications, optionally by status. Shows an application board widget. |
| Resource | `careerpilot://skills-checklist` | In-demand skills for common roles, used to improve a resume. |
| Prompt | `interview_coach` | Runs a mock interview for a role and focuses on the candidate's missing skills. |
| Widget | `match-score` | Score, progress bar, matched and missing skill chips. |
| Widget | `application-board` | Columns for Saved, Applied, Interview, Offer and Rejected. |

All data is mock data kept in memory. It resets when the server restarts.

## Example conversation

> Compare my resume with this job. Resume: Skills: JavaScript, React, Git, SQL, HTML. Job: Frontend Developer, looking for React, TypeScript, CSS and Git skills. Then add this application to my tracker as saved at Google.

The agent calls `analyze_resume` (50% match, missing TypeScript and CSS), then `add_application`, and reports the updated tracker.

## Run it locally

Requires Node.js 20.

```
npm install --legacy-peer-deps
npm run build
npm start
```

Then open the project in NitroStudio and connect over HTTP.

## Built with

- NitroStack SDK (TypeScript)
- NitroStudio for testing
- NitroCloud for deployment
- NitroChat for the public chat

## Author

Jayasheela, solo participant, MCP to the Moon Buildathon.
