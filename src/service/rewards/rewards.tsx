import { useState, useEffect, useCallback, useMemo } from 'react';
import { DASHBOARD_SERVICE_URL } from '../links';
import { REWARDS_SERVICE_URL
    
 } from '../links';
export type DailyRewardStatus = {
    status: 'locked' | 'claimed' | 'not_claimed';
    next_reward_available_in_seconds?: number;
    streak_count: number;
    is_special_reward: boolean;
};

export type ClaimRewardRequest = {
    reward_type: 'download_app' | 'refer_a_friend' | 'join_discord' | 'join_telegram' | 'follow_x' | 'hours_100' | 'daily' | 'days_7_strick' | 'verify_email';
};

export type ClaimRewardResponse = {
    special_reward: boolean;
    boost_duration_in_seconds?: number;
};

export class RewardsService {
    private url: string;
    private token: string;

    constructor(url: string, token: string) {
        this.url = url;
        this.token = token;
    }

    async getDailyRewardStatus(): Promise<DailyRewardStatus> {
        if (!this.token) {
            throw new Error("Daily reward status request: token is empty");
        }

        const response = await fetch(`${this.url}/daily_reward/status`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "User-Agent": `GridApp/1.0`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized - JWT required");
            }
            const bodyText = await response.text();
            throw new Error(`Request failed: ${bodyText}`);
        }

        const data = await response.json();
        return data;
    }

    async claimDailyReward(): Promise<ClaimRewardResponse> {
        if (!this.token) {
            throw new Error("Claim reward request: token is empty");
        }

        const response = await fetch(`${this.url}/rewards/claim`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "User-Agent": `GridApp/1.0`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reward_type: 'daily'
            } as ClaimRewardRequest)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized - JWT required");
            }
            if (response.status === 400) {
                throw new Error("Reward not available");
            }
            const bodyText = await response.text();
            throw new Error(`Request failed: ${bodyText}`);
        }

        const data = await response.json();
        return data;
    }
}

// Hook for managing rewards state and actions
export const useRewards = (token: string | null) => {
    const [status, setStatus] = useState<DailyRewardStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(true);
    const [isClaimed, setIsClaimed] = useState(false);

    const rewardsService = useMemo(() => {
        if (!token) return null;
        return new RewardsService(REWARDS_SERVICE_URL, token);
    }, [token]);

    const fetchStatus = useCallback(async () => {
        if (!rewardsService) return;

        setIsLoading(true);
        setError(null);

        try {
            const statusData = await rewardsService.getDailyRewardStatus();
            setStatus(statusData);
            
            switch (statusData.status) {
                case "locked":
                    setIsLocked(true);
                    setIsClaimed(false);
                    break;
                case "claimed":
                    setIsClaimed(true);
                    setIsLocked(false);
                    break;
                case "not_claimed":
                    setIsClaimed(false);
                    setIsLocked(false);
                    break;
            }
            
            console.log("[Rewards] Status:", statusData.status);
            return statusData;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reward status';
            console.error("[Rewards] Error fetching status:", errorMessage);
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [rewardsService]);

    const claimReward = useCallback(async () => {
        if (!rewardsService) return null;

        setIsLoading(true);
        setError(null);

        try {
            const result = await rewardsService.claimDailyReward();
            // Refresh status after claiming
            await fetchStatus();
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to claim reward';
            console.error("[Rewards] Error claiming reward:", errorMessage);
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [rewardsService, fetchStatus]);

    // Check status every 6 minutes
    useEffect(() => {
        if (!token) {
            console.log("[Rewards] No token available, skipping status check");
            return;
        }

        console.log("[Rewards] Starting status check interval");
        
        // Initial check
        fetchStatus();

        // Set up interval for subsequent checks
        const intervalId = setInterval(fetchStatus, 360000); // 6 minutes
        console.log("[Rewards] Interval set up for every 6 minutes");

        return () => {
            console.log("[Rewards] Cleaning up interval");
            clearInterval(intervalId);
        };
    }, [token, fetchStatus]);

    return {
        status,
        isLoading,
        error,
        claimReward,
        fetchStatus,
        isLocked,
        isClaimed
    };
}; 