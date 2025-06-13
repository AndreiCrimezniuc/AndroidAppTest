import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { Text } from 'react-native';
import Login from "./src/app/login";
import Home from "./src/app/home";

enableScreens();
const Stack = createStackNavigator();

export default function App() {
  // const url = Linking.useURL();
  // if (url) {
  //   const { hostname, path, queryParams } = Linking.parse(url);
  //   console.log(
  //     `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
  //       queryParams
  //     )}`
  //   );
  // }

  return (
    <Text>Hello</Text>
  );
}
