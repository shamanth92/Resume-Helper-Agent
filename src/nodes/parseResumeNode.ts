import { model } from "../config/model";
import { ParseResumePrompt } from "../prompts/parseResumePrompt";
import { AgentState, ResumeSchema } from "../agent/state";
import { ZodError } from "zod";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Helper function to add delay between retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback values for missing fields
const getDefaultResumeData = () => ({
    contact: {
        name: "Unknown",
        email: "",
        phone: "",
        location: "",
    },
    experience: [],
    education: [],
    skills: [],
});

export const parseResumeNode = async (state: typeof AgentState.State) => {
    const resume = state.resume;
    let lastError: Error | null = null;

    // Retry loop
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`[Attempt ${attempt}/${MAX_RETRIES}] Parsing resume...`);
            if (state.executionStates && state.threadId) {
                state.executionStates.set(state.threadId, {
                    ...state.executionStates.get(state.threadId)!,
                    currentNode: "parseResume",
                    status: "parsing_resume",
                    updatedAt: new Date()
                });
            }

            // Call LLM with structured output
            const structuredResume = model.withStructuredOutput(ResumeSchema);
            const parsedResume = await structuredResume.invoke(ParseResumePrompt(resume));

            // Validate with Zod schema
            const validatedData = ResumeSchema.parse(parsedResume);

            console.log(`✓ Resume parsed successfully on attempt ${attempt}`);

            // Apply fallbacks for missing/empty fields
            const dataWithFallbacks = {
                contact: {
                    name: validatedData.contact?.name || "Unknown",
                    email: validatedData.contact?.email || "",
                    phone: validatedData.contact?.phone || "",
                    location: validatedData.contact?.location || "",
                },
                experience: validatedData.experience || [],
                education: validatedData.education || [],
                skills: validatedData.skills || [],
            };

            if (state.executionStates && state.threadId) {
                state.executionStates.set(state.threadId, {
                    ...state.executionStates.get(state.threadId)!,
                    currentNode: "parseResume",
                    status: "parsing_resume",
                    data: { ...state.executionStates.get(state.threadId)!.data, resumeData: dataWithFallbacks },
                    updatedAt: new Date()
                });
            }

            return {
                resumeData: dataWithFallbacks
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
    console.error(`❌ Failed to parse resume after ${MAX_RETRIES} attempts. Using fallback data.`);
    console.error(`Last error:`, lastError?.message);

    return {
        resumeData: getDefaultResumeData()
    };
};