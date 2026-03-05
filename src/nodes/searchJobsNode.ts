import { searchJobs } from "../tools/jobs/searchJobs";
import { AgentState } from "../agent/state";

export const searchJobsNode = async (state: typeof AgentState.State) => {
    const searchQuery = `${state.jobType} ${state.job} jobs in ${state.jobLocation}`
    const jobs = await searchJobs(searchQuery)

    if (state.executionStates && state.threadId) {
        state.executionStates.set(state.threadId, {
            ...state.executionStates.get(state.threadId)!,
            status: "searching_jobs",
            currentNode: "searchJobs",
            data: { ...state.executionStates.get(state.threadId)!.data, jobResults: jobs.data },
            updatedAt: new Date()
        });
    }

    return {
        jobResults: jobs.data
    }
};