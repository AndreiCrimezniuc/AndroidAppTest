import sdkBridge from "./sdk_bridge";

export function startSDK(token: string): Promise<any> {
    const version = getLibVersion()
    if (!version) {
        throw new Error("SDK version is not available. Cannot start SDK.");
    }

    return sdkBridge.start(token)
}

export function getLibVersion(): Promise<string> {
    return sdkBridge.getLibVersion()
}