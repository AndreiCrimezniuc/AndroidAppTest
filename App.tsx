import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';
import Login from "./src/app/login";
import Home from "./src/app/home";
import {LogoutWebView} from "./src/components/Login/LogoutWebView";
import { LoginWebView } from './src/components/Login/LoginWebView';

const Stack = createStackNavigator();

// Loading component
const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
    </View>
);

let globalInitPromise: Promise<string | null> | null = null;

async function getInitialUrl(): Promise<string | null> {
    if (!globalInitPromise) {
        globalInitPromise = (async () => {
            try {
                const url = await Linking.getInitialURL();
                if (url) {
                    const { hostname, path, queryParams } = Linking.parse(url);
                    console.log(
                        `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
                            queryParams
                        )}`
                    );
                }
                return url;
            } catch (error) {
                console.error('Error getting initial URL:', error);
                return null;
            }
        })();
    }
    return globalInitPromise;
}

function AppNavigation() {
    const [isReady, setIsReady] = useState(false);
    const [initialUrl, setInitialUrl] = useState<string | null>(null);
    const initRef = useRef(false);

    useEffect(() => {
        // Prevent double initialization in Strict Mode
        if (initRef.current) return;
        initRef.current = true;

        // Use the cached promise
        getInitialUrl()
            .then(url => {
                setInitialUrl(url);
                setIsReady(true);
            })
            .catch(error => {
                console.error('Failed to get initial URL:', error);
                setIsReady(true);
            });
    }, []);

    if (!isReady) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Index">
                <Stack.Screen
                    name="Index"
                    component={Login}
                    options={{
                        headerShown: false,
                        gestureEnabled: false,
                    }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        headerShown: false,
                        gestureEnabled: false,
                    }}
                />
                <Stack.Screen name="LogoutWebView" component={LogoutWebView} options={{ headerShown: false }} />
                <Stack.Screen name="LoginWebView" component={LoginWebView} options={{ headerShown: false }} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return <AppNavigation />;
}

