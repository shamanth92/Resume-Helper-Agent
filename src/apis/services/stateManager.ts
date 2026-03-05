import { ExecutionState } from "../agentTypes";

export class StateManager {
    private executionStates: Map<string, ExecutionState>;
    private readonly EXECUTION_TTL = 24 * 60 * 60 * 1000; // 24 hours
    private cleanupInterval?: NodeJS.Timeout;

    constructor() {
        this.executionStates = new Map<string, ExecutionState>();
        this.startCleanup();
    }

    private startCleanup() {
        // Cleanup mechanism - remove old execution states after 24 hours
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            for (const [threadId, state] of this.executionStates.entries()) {
                if (now - state.updatedAt.getTime() > this.EXECUTION_TTL) {
                    this.executionStates.delete(threadId);
                    console.log(`🧹 Cleaned up expired thread: ${threadId}`);
                }
            }
        }, 60 * 60 * 1000); // Run cleanup every hour
    }

    getStates(): Map<string, ExecutionState> {
        return this.executionStates;
    }

    getState(threadId: string): ExecutionState | undefined {
        return this.executionStates.get(threadId);
    }

    setState(threadId: string, state: ExecutionState): void {
        this.executionStates.set(threadId, state);
    }

    deleteState(threadId: string): boolean {
        return this.executionStates.delete(threadId);
    }

    cleanup(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}
