export type Earnings = {
    epoch_earnings: number;
    today_earnings: number;
    uptime: number;
    bonus_earning: number;
    uptime_today: number;
};

export class DashboardService {
    private url: string;
    private token: string;

    constructor(url: string, token: string) {
        this.url = url;
        this.token = token;
    }

    async getEarnings(): Promise<Earnings> {
        if (!this.token) {
            throw new Error("Earnings request: token is empty");
        }

        const response = await fetch(`${this.url}/earnings`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "User-Agent": `GridApp/1.0`,
                "Accept": "application/json"
            }
        });

        if (response.status === 404) {
            throw new Error("Error: data not found (404)");
        }

        if (!response.ok) {
            const bodyText = await response.text();
            throw new Error(`Request failed: ${bodyText}`);
        }

        const data = (await response.json()) as Earnings;
        return data;
    }
}