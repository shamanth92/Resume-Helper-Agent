import { graph } from "./graph";
import { Command } from "@langchain/langgraph";
import { ExecutionState } from "../apis/agentTypes";

export const runGraph = async (initialState: {
    resume: string;
    job: string;
    jobType: string;
    jobLocation: string;
    threadId: string;
    executionStates: Map<string, ExecutionState>;
}) => {
    const config = {
        configurable: { thread_id: initialState.threadId }
    };

    console.log(`\n Starting agent for thread: ${initialState.threadId}`);

    try {
        // Execute graph until interrupt or completion
        const result = await graph.invoke({
            ...initialState,
            executionStates: initialState.executionStates,
            threadId: initialState.threadId
        }, config) as any;

        // If completed without interrupt, mark as completed
        if (!result.__interrupt__) {
            initialState.executionStates.set(initialState.threadId, {
                ...initialState.executionStates.get(initialState.threadId)!,
                status: "completed",
                updatedAt: new Date()
            });
            console.log(` Agent completed for thread: ${initialState.threadId}`);
        } else {
            console.log(` Agent paused at interrupt for thread: ${initialState.threadId}`);
        }

        return result;

    } catch (error) {
        console.error(` Error in thread ${initialState.threadId}:`, error);
        
        // Update state to failed
        initialState.executionStates.set(initialState.threadId, {
            ...initialState.executionStates.get(initialState.threadId)!,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
            updatedAt: new Date()
        });
        
        throw error;
    }
}

export const resumeGraph = async (
    threadId: string,
    selectedJobIndex: number,
    executionStates: Map<string, ExecutionState>
) => {
    const config = {
        configurable: { thread_id: threadId }
    };

    console.log(`\n Resuming agent for thread: ${threadId} with selection: ${selectedJobIndex}`);

    try {
        // Resume graph with user's job selection
        // Pass executionStates and threadId so subsequent nodes can update the Map
        const finalResult = await graph.invoke(
            new Command({ 
                resume: selectedJobIndex,
                update: { executionStates, threadId }
            }),
            config
        );

        // Mark as completed
        executionStates.set(threadId, {
            ...executionStates.get(threadId)!,
            status: "completed",
            updatedAt: new Date()
        });

        console.log(` Agent completed for thread: ${threadId}`);
        return finalResult;

    } catch (error) {
        console.error(` Error resuming thread ${threadId}:`, error);
        
        executionStates.set(threadId, {
            ...executionStates.get(threadId)!,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
            updatedAt: new Date()
        });
        
        throw error;
    }
}