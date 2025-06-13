import sdkBridge from "./sdk_bridge";

export default function startSDK(token: string): Promise<any> {
    return sdkBridge.start(token)
}