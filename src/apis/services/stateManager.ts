import { ExecutionState } from "../agentTypes";
import redis from "../state/redis";

export class StateManager {
    private readonly EXECUTION_TTL = 24 * 60 * 60; // 24 hours in seconds (for Redis TTL)
    private readonly KEY_PREFIX = "execution:";

    constructor() {
        // No initialization needed - Redis handles persistence
    }

    private getKey(threadId: string): string {
        return `${this.KEY_PREFIX}${threadId}`;
    }

    async getState(threadId: string): Promise<ExecutionState | null> {
        try {
            const data = await redis.get(this.getKey(threadId));
            if (!data) return null;
            
            const state = JSON.parse(data);
            // Convert date strings back to Date objects
            return {
                ...state,
                startedAt: state.startedAt ? new Date(state.startedAt) : undefined,
                updatedAt: new Date(state.updatedAt)
            };
        } catch (error) {
            console.error(`Error getting state for ${threadId}:`, error);
            return null;
        }
    }

    async setState(threadId: string, state: ExecutionState): Promise<void> {
        try {
            const key = this.getKey(threadId);
            await redis.setex(key, this.EXECUTION_TTL, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting state for ${threadId}:`, error);
            throw error;
        }
    }

    async deleteState(threadId: string): Promise<boolean> {
        try {
            const result = await redis.del(this.getKey(threadId));
            return result > 0;
        } catch (error) {
            console.error(`Error deleting state for ${threadId}:`, error);
            return false;
        }
    }

    async cleanup(): Promise<void> {
        try {
            await redis.quit();
            console.log("Redis connection closed");
        } catch (error) {
            console.error("Error closing Redis connection:", error);
        }
    }

    // Helper method for backward compatibility with routes that expect a Map
    // This creates a temporary in-memory Map for the current request
    async getStatesMap(): Promise<Map<string, ExecutionState>> {
        // This is a compatibility layer - in practice, routes should use getState/setState directly
        // For now, return an empty Map since routes will use the StateManager methods
        return new Map<string, ExecutionState>();
    }
}
