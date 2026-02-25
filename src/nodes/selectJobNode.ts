import { AgentState } from "../state";
import { interrupt } from "@langchain/langgraph";

export const selectJobNode = (state: typeof AgentState.State) => {
    const humanSelectedJob = interrupt({
        message: "Please select a job to tailor your resume for",
        options: state.rankedJobs?.map((job, i) => ({
            value: i,
            label: job?.job_title
        }))
    });
    
    if (humanSelectedJob === undefined) {
        return {};
    }
    
    return {
        selectedJob: state?.rankedJobs?.[humanSelectedJob]
    };
};