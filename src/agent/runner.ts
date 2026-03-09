import { graph } from "./graph";
import { Command } from "@langchain/langgraph";
import { StateManager } from "../apis/services/stateManager";

export const runGraph = async (initialState: {
    resume: string;
    job: string;
    jobType: string;
    jobLocation: string;
    threadId: string;
    stateManager: StateManager;
}) => {
    const config = {
        configurable: { thread_id: initialState.threadId }
    };

    console.log(`\n Starting agent for thread: ${initialState.threadId}`);

    try {
        // Execute graph until interrupt or completion
        const result = await graph.invoke({
            ...initialState,
            stateManager: initialState.stateManager,
            threadId: initialState.threadId
        }, config) as any;

        // If completed without interrupt, mark as completed
        if (!result.__interrupt__) {
            const currentState = await initialState.stateManager.getState(initialState.threadId);
            if (currentState) {
                await initialState.stateManager.setState(initialState.threadId, {
                    ...currentState,
                    status: "completed",
                    updatedAt: new Date()
                });
            }
            console.log(` Agent completed for thread: ${initialState.threadId}`);
        } else {
            console.log(` Agent paused at interrupt for thread: ${initialState.threadId}`);
        }

        return result;

    } catch (error) {
        console.error(` Error in thread ${initialState.threadId}:`, error);
        
        // Update state to failed
        const currentState = await initialState.stateManager.getState(initialState.threadId);
        if (currentState) {
            await initialState.stateManager.setState(initialState.threadId, {
                ...currentState,
                status: "failed",
                error: error instanceof Error ? error.message : "Unknown error",
                updatedAt: new Date()
            });
        }
        
        throw error;
    }
}

export const resumeGraph = async (
    threadId: string,
    selectedJobIndex: number,
    stateManager: StateManager
) => {
    const config = {
        configurable: { thread_id: threadId }
    };

    console.log(`\n Resuming agent for thread: ${threadId} with selection: ${selectedJobIndex}`);

    try {
        // Resume graph with user's job selection
        // Pass stateManager and threadId so subsequent nodes can update Redis
        const finalResult = await graph.invoke(
            new Command({ 
                resume: selectedJobIndex,
                update: { stateManager, threadId }
            }),
            config
        );

        // Mark as completed
        const currentState = await stateManager.getState(threadId);
        if (currentState) {
            await stateManager.setState(threadId, {
                ...currentState,
                status: "completed",
                updatedAt: new Date()
            });
        }

        console.log(` Agent completed for thread: ${threadId}`);
        return finalResult;

    } catch (error) {
        console.error(` Error resuming thread ${threadId}:`, error);
        
        const currentState = await stateManager.getState(threadId);
        if (currentState) {
            await stateManager.setState(threadId, {
                ...currentState,
                status: "failed",
                error: error instanceof Error ? error.message : "Unknown error",
                updatedAt: new Date()
            });
        }
        
        throw error;
    }
}