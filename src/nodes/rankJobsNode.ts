import { AgentState } from "../agent/state";
import { doEmbeddings } from "../tools/embeddings";
import { cosineSimilarity } from "../tools/cosineSimilarity";

export const rankJobsNode = async (state: typeof AgentState.State) => {
    if (state.executionStates && state.threadId) {
        state.executionStates.set(state.threadId, {
            ...state.executionStates.get(state.threadId)!,
            currentNode: "rankJobs",
            status: "ranking_jobs",
            updatedAt: new Date()
        });
    }
    const { resumeEmbedding, jobEmbeddings } = await doEmbeddings(state.jobResults!, state.resumeData);

    const rankedJobs = state.jobResults!.map((job, i) => ({
        ...job,
        similarity: cosineSimilarity(resumeEmbedding, jobEmbeddings[i])
    }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3);

    if (state.executionStates && state.threadId) {
        state.executionStates.set(state.threadId, {
            ...state.executionStates.get(state.threadId)!,
            currentNode: "rankJobs",
            status: "ranking_jobs",
            data: { ...state.executionStates.get(state.threadId)!.data, rankedJobs: rankedJobs },
            updatedAt: new Date()
        });
    }

    return { rankedJobs };
};