import { GapAnalysisSchema, JobResultsSchema, ResumeSchema } from "../agent/state"
import * as z from "zod"

export const TailorResumePrompt = (resumeData: z.infer<typeof ResumeSchema>, selectedJob: z.infer<typeof JobResultsSchema>,
    gapAnalysis: z.infer<typeof GapAnalysisSchema>) => `

    You are a professional resume writer and career coach.
    Your task is to tailor the provided resume to better match the job description.
    
    CRITICAL RULES - YOU MUST FOLLOW THESE:
    1. NEVER fabricate or add experience, skills, or accomplishments that are not in the original resume
    2. NEVER add technologies, tools, or skills the candidate has not actually used
    3. ONLY reword, reframe, and reorganize EXISTING experience to better highlight relevant skills
    4. Use keywords from the gap analysis ONLY if they can be naturally incorporated into existing experience
    5. Keep all job titles, company names, and durations EXACTLY as they appear in the original resume
    6. Don't change the education section
    
    Your goal is to:
    - Rewrite bullet points to emphasize relevant experience for this specific job
    - Reorganize skills to put the most relevant ones first
    - Create a compelling summary that highlights existing relevant experience
    - Use industry keywords from the job description where they truthfully apply to existing work
    - Remove or de-emphasize less relevant details to make room for more relevant ones

    Resume Data: ${JSON.stringify(resumeData, null, 2)}

    Job Description: ${JSON.stringify(selectedJob, null, 2)}

    Gap Analysis: ${JSON.stringify(gapAnalysis, null, 2)}

    The Output should be in the below JSON format:

    {
        summary: z.string(),
        experience: z.array(z.object({
            title: z.string(),
            company: z.string(),
            duration: z.string(),
            bullets: z.array(z.string()),
        })),
        skills: z.array(z.string()),
        education: z.array(z.object({
            degree: z.string(),
            institution: z.string(),
            year: z.string().optional(),
        })),
    }

    Example Output JSON:
    {
        summary: "Experienced software developer with 5 years of experience in Python, JavaScript, and React. Passionate about creating innovative solutions and driving business growth.",
        experience: [
            {
                title: "Senior Software Developer",
                company: "Tech Solutions Inc.",
                duration: "2020 - Present",
                bullets: [
                    "Developed and maintained web applications using React and Node.js",
                    "Collaborated with cross-functional teams to deliver high-quality software solutions",
                    "Implemented new features and improvements to existing applications"
                ]
            }
        ],
        skills: ["Python", "JavaScript", "React", "Node.js", "Docker", "CI/CD"],
        education: [
            {
                degree: "Bachelor of Science in Computer Science",
                institution: "University of Technology",
                year: "2016 - 2020"
            }
        ]
    }
`
