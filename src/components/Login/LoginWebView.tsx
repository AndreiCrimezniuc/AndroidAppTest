import {StyleSheet} from "react-native";
import WebView, { WebViewNavigation } from 'react-native-webview';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import React from "react";
import {AUTH_LINK} from "../../service/auth/links";
import {handleLoginRedirect} from "../../service/auth/auth";


export const LoginWebView  = () => {
    const navigation = useNavigation();

    return (
        <WebView
            source={{uri: AUTH_LINK}}
            style={styles.container}
            onNavigationStateChange={(navState: WebViewNavigation) => handleLoginRedirect(navState, navigation)}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onError={(syntheticEvent: { nativeEvent: any; }) => {
                const {nativeEvent} = syntheticEvent;
                console.error('WebView error: ', nativeEvent);
            }}
            onHttpError={(syntheticEvent: { nativeEvent: any; }) => {
                const {nativeEvent} = syntheticEvent;
                console.error('HTTP error: ', nativeEvent);
            }}
            setSupportMultipleWindows={true}
        />

    );
}

//this style is mandatory for the webview to be displayed
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
});