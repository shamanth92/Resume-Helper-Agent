import { JobResultsSchema, ResumeSchema } from "../agent/state"
import * as z from "zod";

export const AnalyzeGapPrompt = (parsedResume: z.infer<typeof ResumeSchema>, selectedJob: z.infer<typeof JobResultsSchema>) =>  `You are an expert at reviewing resumes.
Act as an ATS (Applicant Tracking System) and a hiring manager.
Your task is to analyze the parsed resume in JSON format and the selected job object.
In the selected job object, you will find the job description and the required skills.
Analyze the resume and identify the gaps between the resume and the job description.

Resume: ${JSON.stringify(parsedResume, null, 2)}

Job Description: ${JSON.stringify(selectedJob, null, 2)}

The Output should be in the below JSON format:

{
    matchingSkills: z.array(z.string()),
    missingSkills: z.array(z.string()),
    keywordsToAdd: z.array(z.string()),
    experienceAlignment: z.string()
}

Example Output JSON:
{
    matchingSkills: ["Python", "Excel", "JavaScript"],
    missingSkills: ["React", "Node.js", "Docker"],
    keywordsToAdd: ["Cloud Computing", "DevOps", "CI/CD"],
    experienceAlignment: "The candidate has 3 years of experience in software development and has worked on multiple projects. However, the candidate lacks experience in cloud computing and devops.",
}
`