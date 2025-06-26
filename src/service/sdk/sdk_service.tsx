import sdkBridge from "./sdk_bridge";

export async function startSDK(token: string): Promise<void> {
    const version = await getLibVersion();
    if (!version) {
        throw new Error("SDK version is not available. Cannot start SDK.");
    }

    try {
        await sdkBridge.start(token); // <-- ничего не возвращает
        console.log("SDK started successfully");
    } catch (error) {
        console.error("Failed to start SDK:", error);
        throw new Error(`[SDK] Failed to start: ${error}`);
    }
}


export function getLibVersion(): Promise<string> {
    return sdkBridge.getLibVersion()
}