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
})

export const AgentState = new StateSchema({
    resume: z.string(),
    resumeData: ResumeSchema.optional(),
    job: z.string(),
    jobType: z.string(),
    jobLocation: z.string(),
    jobResults: z.array(z.object({
        title: z.string(),
        company: z.string(),
        description: z.string(),
        url: z.string(),
        location: z.string().optional(),
        salary: z.string().optional(),
    })).optional(),
    selectedJob: z.object({
        title: z.string(),
        company: z.string(),
        description: z.string(),
        url: z.string(),
        location: z.string().optional(),
        salary: z.string().optional(),
    }).optional(),
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