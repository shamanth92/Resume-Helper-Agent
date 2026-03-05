import { AgentState } from "../agent/state";
import { interrupt } from "@langchain/langgraph";

export const selectJobNode = (state: typeof AgentState.State) => {
    if (state.executionStates && state.threadId) {
        state.executionStates.set(state.threadId, {
            ...state.executionStates.get(state.threadId)!,
            currentNode: "selectJob",
            status: "waiting_for_input",  // ← Key change
            data: {
                ...state.executionStates.get(state.threadId)!.data,
                rankedJobs: state.rankedJobs  // Include ranked jobs for frontend
            },
            updatedAt: new Date()
        });
    }

    const humanSelectedJob = interrupt({
        message: "Please select a job to tailor your resume for",
        options: state.rankedJobs?.map((job, i) => ({
            value: i + 1,  // Use 1-based indexing (1, 2, 3)
            label: job?.job_title
        }))
    });

    if (humanSelectedJob === undefined) {
        return {};
    }

    // Store selected job in data, but don't override status
    // Let the next nodes (analyzeGap, tailorResume) set their own statuses
    if (state.executionStates && state.threadId) {
        state.executionStates.set(state.threadId, {
            ...state.executionStates.get(state.threadId)!,
            currentNode: "selectJob",
            data: {
                ...state.executionStates.get(state.threadId)!.data,
                selectedJob: state?.rankedJobs?.[humanSelectedJob - 1]
            },
            updatedAt: new Date()
        });
    }

    return {
        selectedJob: state?.rankedJobs?.[humanSelectedJob - 1]  // Convert back to 0-based for array access
    };
};