import { AgentState, TailoredResumeSchema } from "../agent/state";
import { model } from "../config/model";
import { ZodError } from "zod";
import { TailorResumePrompt } from "../prompts/tailorResumePrompt";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Helper function to add delay between retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback values for missing fields
const getDefaultGapsData = () => ({
    summary: "",
    experience: [],
    skills: [],
    education: [],
});


export const tailorResumeNode = async (state: typeof AgentState.State) => {
    const resumeData = state.resumeData;
    const selectedJob = state.selectedJob;
    const gapAnalysis = state.gapAnalysis;
    let lastError: Error | null = null;

    if (!resumeData || !selectedJob || !gapAnalysis) {
        console.error('❌ Missing resume data or selected job or gap analysis');
        return { tailoredResume: getDefaultGapsData() };
    }

    // Retry loop
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`[Attempt ${attempt}/${MAX_RETRIES}] Tailoring resume...`);

            // Call LLM with structured output
            const structuredTailoredResume = model.withStructuredOutput(TailoredResumeSchema);
            const tailoredResume = await structuredTailoredResume.invoke(TailorResumePrompt(resumeData, selectedJob, gapAnalysis));

            // Validate with Zod schema
            const validatedData = TailoredResumeSchema.parse(tailoredResume);

            // Apply fallbacks for missing/empty fields
            const dataWithFallbacks = {
                summary: validatedData.summary || "",
                experience: validatedData.experience || [],
                skills: validatedData.skills || [],
                education: validatedData.education || [],
            };

            return {
                tailoredResume: dataWithFallbacks
            };

        } catch (error) {
            lastError = error as Error;

            if (error instanceof ZodError) {
                console.error(`✗ Validation error on attempt ${attempt}:`, error.issues);
            } else {
                console.error(`✗ Parsing error on attempt ${attempt}:`, error);
            }

            // If not the last attempt, wait before retrying
            if (attempt < MAX_RETRIES) {
                console.log(`⏳ Retrying in ${RETRY_DELAY_MS}ms...`);
                await delay(RETRY_DELAY_MS);
            }
        }
    }

    // All retries failed - return default data with error logged
    console.error(`❌ Failed to tailor resume after ${MAX_RETRIES} attempts. Using fallback data.`);

    return {
        tailoredResume: getDefaultGapsData()
    };
};