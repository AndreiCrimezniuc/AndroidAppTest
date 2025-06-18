import {useCallback, useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {NavigationProp} from "../navigation";
import {tokenStorage} from "../storage/tokenStorage";
import {Alert} from "react-native";

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoadingToken, setIsLoadingToken] = useState(true);
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        const loadToken = async () => {
            try {
                const value = await tokenStorage.getToken();
                console.log('Retrieved token:', value ? 'Present' : 'Not found');
                setToken(value);
            } catch (error) {
                console.error('Failed to get token:', error);
            } finally {
                setIsLoadingToken(false);
            }
        };

        loadToken();
    }, []);

    const logout = useCallback(async () => {
        try {
            await tokenStorage.removeToken();
            console.log('Token removed successfully');
        } catch (error) {
            console.error('Error removing token:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
            return;
        }

        navigation.navigate("LogoutWebView");
    }, [navigation]);

    return {token, isLoadingToken, logout};
};