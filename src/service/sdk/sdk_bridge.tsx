import { NativeModules, Platform } from 'react-native';

// Extract and check for the native module
const { SDK: NativeSdkBridge } = NativeModules;

if (!NativeSdkBridge) {
    throw new Error('SDK native module is not available. Ensure it is properly linked.');
}

// Define an interface for expected SDK methods
interface ISdkBridge {
    getLibVersion(): Promise<string>;
    start(token: unknown): Promise<any>;
}

// Singleton instance of the bridge
const sdkBridge: ISdkBridge = {
    async getLibVersion() {
        try {
            return await NativeSdkBridge.callGetLibVersion();
        } catch (error) {
            console.error('[SDK] Failed to get library version:', error);
            throw error;
        }
    },

    async start(token: unknown) {
        try {
            return await NativeSdkBridge.callStart(token);
        } catch (error) {
            console.error('[SDK] Failed to start SDK:', error);
            throw error;
        }
    }
};

export default sdkBridge;
