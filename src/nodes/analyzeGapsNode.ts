import { model } from "../config/model";
import { AnalyzeGapPrompt } from "../prompts/analyzeGapPrompt";
import { AgentState, GapAnalysisSchema } from "../agent/state";
import { ZodError } from "zod";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Helper function to add delay between retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback values for missing fields
const getDefaultGapsData = () => ({
    matchingSkills: [],
    missingSkills: [],
    keywordsToAdd: [],
    experienceAlignment: "",
});

export const analyzeGapNode = async (state: typeof AgentState.State) => {
    const parsedResume = state.resumeData;
    const selectedJob = state.selectedJob;
    let lastError: Error | null = null;

    if (!parsedResume || !selectedJob) {
        console.error('❌ Missing resume data or selected job');
        return { gapAnalysis: getDefaultGapsData() };
    }

    // Retry loop
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`[Attempt ${attempt}/${MAX_RETRIES}] Analyzing gaps...`);
            if (state.executionStates && state.threadId) {
                state.executionStates.set(state.threadId, {
                    ...state.executionStates.get(state.threadId)!,
                    currentNode: "analyzeGap",
                    status: "gap_analysis",
                    // data: { ...state.executionStates.get(state.threadId)!.data, gapAnalysis: dataWithFallbacks },
                    updatedAt: new Date()
                });
            }

            // Call LLM with structured output
            const structuredAnalyzeGap = model.withStructuredOutput(GapAnalysisSchema);
            const resumeGapAnalysis = await structuredAnalyzeGap.invoke(AnalyzeGapPrompt(parsedResume, selectedJob));

            // Validate with Zod schema
            const validatedData = GapAnalysisSchema.parse(resumeGapAnalysis);

            // Apply fallbacks for missing/empty fields
            const dataWithFallbacks = {
                matchingSkills: validatedData.matchingSkills || [],
                missingSkills: validatedData.missingSkills || [],
                keywordsToAdd: validatedData.keywordsToAdd || [],
                experienceAlignment: validatedData.experienceAlignment || "",
            };

            if (state.executionStates && state.threadId) {
                state.executionStates.set(state.threadId, {
                    ...state.executionStates.get(state.threadId)!,
                    currentNode: "analyzeGap",
                    status: "gap_analysis",
                    data: { ...state.executionStates.get(state.threadId)!.data, gapAnalysis: dataWithFallbacks },
                    updatedAt: new Date()
                });
            }

            return {
                gapAnalysis: dataWithFallbacks
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
    console.error(`❌ Failed to analyze gaps after ${MAX_RETRIES} attempts. Using fallback data.`);

    return {
        gapAnalysis: getDefaultGapsData()
    };

};