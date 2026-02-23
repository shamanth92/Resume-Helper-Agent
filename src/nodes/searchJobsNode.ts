import { searchJobs } from "../jobs/searchJobs";
import { AgentState } from "../state";

export const searchJobsNode = async (state: typeof AgentState.State) => {
    console.log('search state: ', state)
    const searchQuery = `${state.jobType} ${state.job} jobs in ${state.jobLocation}`
    const jobs = await searchJobs(searchQuery)
    console.log('job results node: ', {
        jobResults: jobs
    })
    return {
        jobResults: jobs.data
    }
};