import { StateSchema } from "@langchain/langgraph";
import * as z from "zod";

export const ResumeSchema = z.object({
    contact: z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        location: z.string(),
    }),
    experience: z.array(z.object({
        title: z.string(),
        company: z.string(),
        duration: z.string(),
        bullets: z.array(z.string()),
    })),
    education: z.array(z.object({
        degree: z.string(),
        institution: z.string(),
        year: z.string(),
    })),
    skills: z.array(z.string()),
});

export const JobResultsSchema = z.object({
        job_title: z.string(),
        employer_name: z.string(),
        employer_logo: z.string(),
        employer_website: z.string(),
        job_employment_type: z.string(),
        job_description: z.string(),
        job_apply_link: z.string(),
        qualifications: z.array(z.string()).optional(),
        responsibilities: z.array(z.string()).optional(),
        job_location: z.string(),
        job_salary_string: z.string(),
    }).optional()

export const RankedJobSchema = z.object({
        job_title: z.string(),
        employer_name: z.string(),
        employer_logo: z.string(),
        employer_website: z.string(),
        job_employment_type: z.string(),
        job_description: z.string(),
        job_apply_link: z.string(),
        qualifications: z.array(z.string()).optional(),
        responsibilities: z.array(z.string()).optional(),
        job_location: z.string(),
        job_salary_string: z.string(),
        similarity: z.number(),
    }).optional()

export const AgentState = new StateSchema({
    resume: z.string(),
    resumeData: ResumeSchema.optional(),
    job: z.string(),
    jobType: z.string(),
    jobLocation: z.string(),
    jobResults: JobResultsSchema.array().optional(),
    rankedJobs: RankedJobSchema.array().optional(),
    selectedJob: JobResultsSchema.optional(),
    tailoredResume: z.object({
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
    }).optional(),
    gapAnalysis: z.object({
        matchingSkills: z.array(z.string()),
        missingSkills: z.array(z.string()),
        keywordsToAdd: z.array(z.string()),
        experienceAlignment: z.string(),
    }).optional(),
    outputPath: z.string().optional(),
});