export type ReferralInfo = {
    referrals: number;
    pending_referrals: number;
    referral_link: string;
};

export class ReferralService {
    private url: string;
    private token: string;

    constructor(url: string, token: string) {
        this.url = url;
        this.token = token;
    }

    async getReferralInfo(): Promise<ReferralInfo> {
        if (!this.token) {
            throw new Error("referral code request: token is empty");
        }

        const response = await fetch(`${this.url}/public/account/referral_info`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "User-Agent": `YourAppName/1.0`, // или динамический user agent
                "Accept": "application/json"
            }
        });

        if (response.status === 401) {
            throw new Error("Unauthorized (401)");
        }

        if (!response.ok) {
            const bodyText = await response.text();
            throw new Error(`Request failed: ${bodyText}`);
        }

        const data = (await response.json()) as ReferralInfo;
        return data;
    }
}
