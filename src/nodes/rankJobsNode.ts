import { AgentState } from "../agent/state";
import { doEmbeddings } from "../tools/embeddings";
import { cosineSimilarity } from "../tools/cosineSimilarity";

export const rankJobsNode = async (state: typeof AgentState.State) => {
    if (state.stateManager && state.threadId) {
        const currentState = await state.stateManager.getState(state.threadId);
        if (currentState) {
            await state.stateManager.setState(state.threadId, {
                ...currentState,
                currentNode: "rankJobs",
                status: "ranking_jobs",
                updatedAt: new Date()
            });
        }
    }
    const { resumeEmbedding, jobEmbeddings } = await doEmbeddings(state.jobResults!, state.resumeData);

    const rankedJobs = state.jobResults!.map((job, i) => ({
        ...job,
        similarity: cosineSimilarity(resumeEmbedding, jobEmbeddings[i])
    }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3);

    if (state.stateManager && state.threadId) {
        const currentState = await state.stateManager.getState(state.threadId);
        if (currentState) {
            await state.stateManager.setState(state.threadId, {
                ...currentState,
                currentNode: "rankJobs",
                status: "ranking_jobs",
                data: { ...currentState.data, rankedJobs: rankedJobs },
                updatedAt: new Date()
            });
        }
    }

    return { rankedJobs };
};