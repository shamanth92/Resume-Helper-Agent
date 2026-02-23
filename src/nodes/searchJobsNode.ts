import { searchJobs } from "../jobs/searchJobs";
import { AgentState } from "../state";

export const searchJobsNode = async (state: typeof AgentState.State) => {
    const searchQuery = `${state.jobType} ${state.job} jobs in ${state.jobLocation}`
    const jobs = await searchJobs(searchQuery)
    return {
        jobResults: jobs.data
    }
};