# Resume Helper Agent

An AI-powered REST API that tailors resumes to specific job descriptions using LangGraph, OpenAI, and intelligent job matching.

## 🚀 Features

- **Smart Job Matching** - Searches and ranks jobs using semantic similarity
- **AI Resume Tailoring** - Optimizes resume content for selected job descriptions
- **Gap Analysis** - Identifies missing skills and suggests improvements
- **Document Generation** - Creates professional DOCX resumes with S3 signed URLs
- **Human-in-the-Loop** - User selects from top 3 ranked jobs
- **Production Ready** - Redis state management, deployed on Render

## 📋 Prerequisites

- Node.js 18+
- OpenAI API key
- JSearch API key (RapidAPI)
- AWS S3 bucket (for document storage)
- Redis (local or Render)

## 🛠️ Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ResumeHelperAgent

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys
```

## ⚙️ Environment Variables

Create a `.env` file with:

```bash
OPENAI_API_KEY=your_openai_api_key
JSEARCH_API_KEY=your_jsearch_api_key
JSEARCH_API_HOST=jsearch.p.rapidapi.com
S3_BUCKET=your-s3-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
REDIS_URL=redis://localhost:6379
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

## 🏃 Running Locally

### Start Redis (Docker)
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

### Start the API
```bash
npm start
```

Server runs on `http://localhost:5000`

## 📡 API Endpoints

### 1. Start Agent
```bash
POST /api/resume/startAgent
Content-Type: application/json

{
  "resumeText": "Your resume text...",
  "job": "software engineer",
  "jobType": "Full-time",
  "jobLocation": "Chicago"
}

# Returns: { "threadId": "resume-helper-1234567890" }
```

### 2. Check Status
```bash
GET /api/resume/getAgentStatus?threadId=resume-helper-1234567890

# Poll every 2-3 seconds until status is "waiting_for_input" or "completed"
```

### 3. Select Job
```bash
POST /api/resume/selectJob
Content-Type: application/json

{
  "threadId": "resume-helper-1234567890",
  "selectedJobIndex": 1
}
```

### 4. Get Final Resume
Poll status endpoint until `status: "completed"`, then retrieve `outputPath` (S3 signed URL) from the response.

## 🎯 Usage Example

```bash
# 1. Start the agent
curl -X POST http://localhost:5000/api/resume/startAgent \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "John Doe\nSoftware Engineer...",
    "job": "Senior Frontend Engineer",
    "jobType": "Full-time",
    "jobLocation": "San Francisco"
  }'

# Response: { "threadId": "resume-helper-1710123456789" }

# 2. Poll for status
curl "http://localhost:5000/api/resume/getAgentStatus?threadId=resume-helper-1710123456789"

# When status is "waiting_for_input", you'll see rankedJobs in the response

# 3. Select a job
curl -X POST http://localhost:5000/api/resume/selectJob \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "resume-helper-1710123456789",
    "selectedJobIndex": 1
  }'

# 4. Continue polling until status is "completed"
# Download resume from the outputPath URL in the response
```

## 🌐 Deployment

Deployed on **Render** with:
- Web Service (Node.js)
- Redis (25MB free tier)
- Auto-deploy from GitHub

**Live API:** `https://your-app.onrender.com`

See [agent.md](./agent.md) for detailed deployment instructions.

## 📚 Documentation

For detailed architecture, design decisions, and technical documentation, see [agent.md](./agent.md).

## 🧪 Testing

```bash
# Test individual nodes
npm run test:parse
npm run test:search
npm run test:rank
npm run test:gap
npm run test:tailor

# Test full workflow
npm run test:full
```

## 🏗️ Architecture

```
User → POST /startAgent → Agent (LangGraph)
                            ↓
                    [Parse → Search → Rank]
                            ↓
                    🛑 INTERRUPT (Select Job)
                            ↓
                    [Analyze → Tailor → Generate]
                            ↓
                    S3 Upload → Signed URL
```

**State Management:** Redis (persistent, scalable)  
**Document Storage:** AWS S3  
**Agent Framework:** LangGraph  
**LLM:** OpenAI GPT-4o-mini

## 📦 Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Agent:** LangGraph, LangChain
- **AI:** OpenAI (GPT-4o-mini, text-embedding-3-small)
- **State:** Redis (ioredis)
- **Storage:** AWS S3
- **Document:** docx
- **Deployment:** Render

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📝 License

ISC

## 👤 Author

**Shamanth Kumar**  
📧 alekh.shamanth@gmail.com

---

⭐ **Star this repo if you find it useful!**
