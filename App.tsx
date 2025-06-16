import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import Login from "./src/app/login";
import Home from "./src/app/home";

const Stack = createStackNavigator();

export default function App() {
    const [initialUrl, setInitialUrl] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const getUrl = async () => {
            try {
                const url = await Linking.getInitialURL();
                if (url) {
                    setInitialUrl(url);
                    const { hostname, path, queryParams } = Linking.parse(url);
                    console.log(
                        `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
                            queryParams
                        )}`
                    );
                }
            } catch (error) {
                console.error('Error getting initial URL:', error);
            } finally {
                setIsReady(true);
            }
        };

        getUrl();
    }, []);

    // Don't render navigation until we've checked for initial URL
    if (!isReady) {
        return null; // or a loading component
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Index">
                <Stack.Screen name="Index" component={Login} />
                <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}