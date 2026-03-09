import { AgentState } from "../agent/state";
import { interrupt } from "@langchain/langgraph";

export const selectJobNode = async (state: typeof AgentState.State) => {
    if (state.stateManager && state.threadId) {
        const currentState = await state.stateManager.getState(state.threadId);
        if (currentState) {
            await state.stateManager.setState(state.threadId, {
                ...currentState,
                currentNode: "selectJob",
                status: "waiting_for_input",
                data: {
                    ...currentState.data,
                    rankedJobs: state.rankedJobs
                },
                updatedAt: new Date()
            });
        }
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
    if (state.stateManager && state.threadId) {
        const currentState = await state.stateManager.getState(state.threadId);
        if (currentState) {
            await state.stateManager.setState(state.threadId, {
                ...currentState,
                currentNode: "selectJob",
                data: {
                    ...currentState.data,
                    selectedJob: state?.rankedJobs?.[humanSelectedJob - 1]
                },
                updatedAt: new Date()
            });
        }
    }

    return {
        selectedJob: state?.rankedJobs?.[humanSelectedJob - 1]  // Convert back to 0-based for array access
    };
};