import sdkBridge from "./sdk_bridge";

export function startSDK(token: string): Promise<any> {
    return sdkBridge.start(token)
}

export function getLibVersion(): Promise<string> {
    return sdkBridge.getLibVersion()
}