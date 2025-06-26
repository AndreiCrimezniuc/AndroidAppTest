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

  async getEarnings(maxRetries = 5): Promise<Earnings> {
    if (!this.token) {
      throw new Error("Earnings request: token is empty");
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.url}/earnings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "User-Agent": `GridApp/1.0`,
            Accept: "application/json",
          },
        });

        if (response.status === 404) {
          throw new Error("Error: data not found (404)");
        }

        if (!response.ok) {
          const bodyText = await response.text();
          console.error(`❌ Bad Earnings Request (attempt ${attempt}):`, {
            url: `${this.url}/earnings`,
            headers: {
              Authorization: `Bearer ${this.token}`,
              "User-Agent": "GridApp/1.0",
              Accept: "application/json",
            },
            bodyText,
          });
          throw new Error(`Request failed: ${bodyText}`);
        }

        const data = (await response.json()) as Earnings;

        console.info(` Good Earnings Request (attempt ${attempt})`);
        return data;
      } catch (error) {
        console.warn(`Attempt ${attempt} failed:`, error);

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 second
        } else {
          console.error(`❌ All ${maxRetries} attempts failed`);
          throw error;
        }
      }
    }

    // Fallback - should never reach here
    throw new Error("Unexpected failure in getEarnings()");
  }
}
