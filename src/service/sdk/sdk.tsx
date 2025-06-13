import { NativeModules, Platform } from 'react-native';

const { SDK } = NativeModules;

if (!SDK) {
    throw new Error('SDK is not available. Make sure the native module is properly linked.');
}

export default {
    getLibVersion: async () => {
        try {
            return await SDK.callGetLibVersion();
        } catch (error) {
            console.error('Error getting library version:', error);
            throw error;
        }
    },

    start: async (input: any) => {
        try {
            return await SDK.callStart(input);
        } catch (error) {
            console.error('Error starting library:', error);
            throw error;
        }
    }
};