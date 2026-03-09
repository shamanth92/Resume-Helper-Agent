import { searchJobs } from "../tools/jobs/searchJobs";
import { AgentState } from "../agent/state";

export const searchJobsNode = async (state: typeof AgentState.State) => {
    const searchQuery = `${state.jobType} ${state.job} jobs in ${state.jobLocation}`
    const jobs = await searchJobs(searchQuery)

    if (state.stateManager && state.threadId) {
        const currentState = await state.stateManager.getState(state.threadId);
        if (currentState) {
            await state.stateManager.setState(state.threadId, {
                ...currentState,
                status: "searching_jobs",
                currentNode: "searchJobs",
                data: { ...currentState.data, jobResults: jobs.data },
                updatedAt: new Date()
            });
        }
    }

    return {
        jobResults: jobs.data
    }
};