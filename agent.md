# Resume Helper Agent

## Overview
An AI-powered agent that tailors resumes to specific job descriptions using LangGraph, OpenAI, and job search APIs.

## What It Does
1. Parses user's resume text
2. Searches for relevant jobs based on user query
3. Ranks 3 top jobs by similarity to resume
4. Allows user to select a job
5. Analyzes gaps between resume and the selected job requirements
6. Tailors resume content to match job description
7. Returns a formatted DOCX document in the form of a AWS S3 signed URL for user to download

## Architecture

### State Schema
```typescript
{
  resume: string,              // Raw resume text input
  resumeData: object,          // Parsed/structured resume
  job: string,                 // Job title to search for
  jobType: string,             // Full-time, Part-time, etc.
  jobLocation: string,         // Geographic location
  jobResults: array,           // Raw results from job API
  rankedJobs: array,           // Top 3 jobs by similarity
  selectedJob: object,         // Job user selected
  gapAnalysis: object,         // Comparison analysis
  tailoredResume: object,      // Optimized resume content
  outputPath: string,          // S3 signed URL for download
  threadId: string,            // Unique execution ID
  stateManager: StateManager   // Redis state manager (API mode)
}
```

### Agent Flow
```
START
  ↓
[Parse Resume] → Extract structure from text
  ↓
[Search Jobs] → Call JSearch API
  ↓
[Rank Jobs] → Use embeddings to calculate similarity
  ↓
[Select Job] → 🛑 INTERRUPT - Wait for user selection
  ↓
[Analyze Gap] → Compare resume vs job requirements
  ↓
[Tailor Resume] → Rewrite content to match job
  ↓
[Generate Document] → Return AWS S3 signed url to download resume
  ↓
END
```

### Nodes

| Node | Purpose | Input | Output |
|------|---------|-------|--------|
| `parseResumeNode` | Extract structured data from text | resume (string) | resumeData (object) |
| `searchJobsNode` | Find relevant jobs | Job Query (job, job location, job type) | jobResults (array) |
| `rankJobsNode` | Score jobs by match | resumeData, jobResults | rankedJobs (top 3) |
| `selectJobNode` | Human selects job (interrupt) | rankedJobs | selectedJob |
| `analyzeGapNode` | Compare resume to job | resumeData, selectedJob | gapAnalysis |
| `tailorResumeNode` | Optimize resume content | resumeData, gapAnalysis | tailoredResume |
| `generateDocumentNode` | Create DOCX file | tailoredResume | outputPath |

## Tools & APIs

### External APIs
- **OpenAI API** - GPT-5-mini for parsing, analysis, tailoring
- **OpenAI Embeddings** - text-embedding-3-small for similarity
- **JSearch API** (RapidAPI) - Job search aggregator

### Libraries
- `@langchain/langgraph` - Agent orchestration
- `@langchain/openai` - OpenAI integration
- `docx` - Document generation
- `ml-distance` - Cosine similarity calculation
- `zod` - State schema validation
- `express` - REST API server
- `ioredis` - Redis client for state management
- `cors` - Cross-origin resource sharing
- `@aws-sdk/client-s3` - S3 file upload
- `@aws-sdk/s3-request-presigner` - Generate signed URLs

## Setup & Installation

### Prerequisites
- Node.js 18+
- OpenAI API key
- JSearch API key (RapidAPI)

### Installation
```bash
npm install
```

### Environment Variables
```bash
OPENAI_API_KEY=
JSEARCH_API_KEY=
JSEARCH_API_HOST=
PORT=
S3_BUCKET=
AWS_REGION=
FRONTEND_URL=
REDIS_URL=
```

### Run
```bash
npm start
```

## Usage

### Programmatic Usage
```typescript
import { graph } from './stateGraph';
import { v4 as uuidv4 } from 'uuid';

const threadId = uuidv4();
const config = { configurable: { thread_id: threadId } };

// Start agent
const result1 = await graph.invoke({
  resume: "Your resume text...",
  job: "software engineer",
  jobLocation: "USA",
  jobType: "Full Time"
}, config);

// Resume after interrupt with user selection
const result2 = await graph.invoke(
  new Command({ resume: 2 }), // Selected job index
  config
);
```

### REST API Usage

**Start Agent:**
```bash
POST /api/resume/startAgent
Content-Type: application/json

{
  "resumeText": "Your resume text here...",
  "job": "software engineer",
  "jobType": "Full-time",
  "jobLocation": "Chicago"
}

# Response (202 Accepted):
{
  "threadId": "resume-helper-1234567890",
  "message": "Agent started successfully"
}
```

**Check Status (Poll every 2-3 seconds):**
```bash
GET /api/resume/getAgentStatus?threadId=resume-helper-1234567890

# Response while processing:
{
  "status": "parsing_resume",
  "currentNode": "parseResume",
  "data": {},
  "startedAt": "2025-03-10T10:00:00.000Z",
  "updatedAt": "2025-03-10T10:00:05.000Z"
}

# Response at interrupt:
{
  "status": "waiting_for_input",
  "currentNode": "selectJob",
  "data": {
    "rankedJobs": [
      { "job_title": "Senior Software Engineer", "employer_name": "Google", ... },
      { "job_title": "Backend Engineer", "employer_name": "Meta", ... },
      { "job_title": "Full Stack Developer", "employer_name": "Stripe", ... }
    ]
  },
  "updatedAt": "2025-03-10T10:00:25.000Z"
}
```

**Select Job:**
```bash
POST /api/resume/selectJob
Content-Type: application/json

{
  "threadId": "resume-helper-1234567890",
  "selectedJobIndex": 1
}

# Response (202 Accepted):
{
  "message": "Agent started successfully"
}
```

**Final Status (After completion):**
```bash
GET /api/resume/getAgentStatus?threadId=resume-helper-1234567890

# Response:
{
  "status": "completed",
  "currentNode": "generateDocument",
  "data": {
    "outputPath": "https://your-bucket.s3.amazonaws.com/resumes/...",
    "tailoredResume": { ... },
    "gapAnalysis": { ... }
  },
  "updatedAt": "2025-03-10T10:01:30.000Z"
}
```

## Key Design Decisions

### Why Embeddings for Ranking?
- Semantic matching (not just keyword matching)
- Captures meaning, not just exact words
- Better matches than simple text search

### Why Human-in-the-Loop?
- User knows best which job fits their goals
- Prevents agent from making wrong assumptions
- Builds trust (user sees options before committing)

### Why Text Input (Not PDF Upload)?
- Simpler implementation (no parsing complexity)
- User has full control over content
- Works with any source (PDF, DOCX, Google Docs)
- Can add file upload later as enhancement

## Known Limitations

- JSearch API limited to certain regions
- No cover letter generation (planned)
- Single resume output (no A/B testing)
- Basic DOCX formatting (no custom templates)
- S3 storage required (not local file system)
- Render free tier has cold starts (~30 seconds)

## Future Enhancements

### Phase 2 (Planned)
- [ ] Cover letter generation
- [ ] PDF file upload support
- [ ] Multiple resume versions
- [ ] ATS score checker
- [ ] LinkedIn profile optimizer

### Phase 3 (Ideas)
- [ ] Interview prep questions
- [ ] Salary insights
- [ ] Company research summary
- [ ] Application tracking
- [ ] Email integration

## Testing

### Manual Testing
```bash
# Test with sample resume
npm run test:sample

# Test with different job types
npm run test:jobs
```

### Edge Cases Handled
- No jobs found → Helpful message + retry option
- User cancels selection → Graceful exit
- API failures → Error handling + retry logic
- Invalid resume format → Prompt for better input

## Performance

### Typical Execution Time
- Parse Resume: ~5-10s
- Search Jobs: ~3-5s
- Rank Jobs: ~5-7s (embeddings for 20 jobs)
- Tailor Resume: ~10-15s
- Generate Document: ~1-2s

**Total: ~40-50 seconds**

### Cost Estimate (per run)
- GPT-5-mini calls: ~$0.05
- Embeddings: ~$0.002
- JSearch API: ~$0.002

**Total: ~$0.054 per resume**

## Troubleshooting

### Common Issues

**"TypeError: t.replace is not a function"**
- Cause: Passing non-string to embedDocuments
- Fix: Ensure all inputs are strings

**"API rate limit exceeded"**
- Cause: Too many requests
- Fix: Add delays between API calls

**"Job selection not working"**
- Cause: Thread ID mismatch
- Fix: Use same thread ID for invoke/resume

## Project Structure
```
resume-helper/
├── src/
│   ├── agent/
│   │   ├── graph.ts         # LangGraph definition
│   │   ├── runner.ts        # Graph execution logic
│   │   └── state.ts         # State schema
│   ├── apis/
│   │   ├── index.ts         # Express server
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Request logging, errors
│   │   ├── services/        # StateManager
│   │   └── state/           # Redis client
│   ├── nodes/               # Agent nodes
│   ├── prompts/             # LLM prompts
│   ├── tools/               # Utilities (embeddings, jobs, docx)
│   ├── config/              # Environment config
│   └── tests/               # Test files
├── .env.example             # Environment template
└── agent.md                 # This file
```

## Contact
Shamanth Kumar (alekh.shamanth@gmail.com)

## Changelog

### v2.0.0 (2025-03-10)
- ✅ REST API with Express
- ✅ Redis state management (production-ready)
- ✅ S3 document storage with signed URLs
- ✅ Deployed on Render
- ✅ Async state updates for real-time polling
- ✅ Background job execution

### v1.0.0 (2025-03-02)
- Initial CLI release
- Basic resume tailoring functionality
- JSearch integration
- DOCX output

---
