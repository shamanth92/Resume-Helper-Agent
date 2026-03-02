import { AgentState } from "../agent/state";
import { interrupt } from "@langchain/langgraph";

export const selectJobNode = (state: typeof AgentState.State) => {
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
    
    return {
        selectedJob: state?.rankedJobs?.[humanSelectedJob - 1]  // Convert back to 0-based for array access
    };
};