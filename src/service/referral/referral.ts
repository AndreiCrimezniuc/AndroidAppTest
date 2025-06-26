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

  async getReferralInfo(maxRetries = 5): Promise<ReferralInfo> {
    if (!this.token) {
      throw new Error("Referral info request: token is empty");
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(
          `${this.url}/public/account/referral_info`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${this.token}`,
              "User-Agent": `GridApp/1.0`,
              Accept: "application/json",
            },
          },
        );

        if (response.status === 401) {
          throw new Error("Unauthorized (401)");
        }

        if (!response.ok) {
          const bodyText = await response.text();
          console.warn(`❌ Bad request (attempt ${attempt}): ${bodyText}`);
          throw new Error(`Request failed: ${bodyText}`);
        }

        const data = (await response.json()) as ReferralInfo;
        console.log(`✅ Referral info fetched (attempt ${attempt})`);
        return data;
      } catch (err) {
        console.warn(
          `⚠️ Attempt ${attempt} to fetch referral info failed`,
          err,
        );
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s delay
        } else {
          console.error("❌ All attempts to fetch referral info failed");
          throw err;
        }
      }
    }

    throw new Error("Unexpected failure in getReferralInfo()");
  }
}
