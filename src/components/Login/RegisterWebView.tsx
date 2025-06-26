import {StyleSheet} from "react-native";
import WebView from 'react-native-webview';
import Constants from 'expo-constants';
import {WebViewNavigationEvent} from "react-native-webview/lib/RNCWebViewNativeComponent";
import React from "react";
import {GRID_HARD_LINK_BASE, REGISTER_URL} from "../../service/links";
import {handleLoginRedirect, handleRegisterRedirect} from "../../service/auth/auth";
import {useNavigation} from "@react-navigation/native";

export const RegisterWebView = () => {
    const navigation = useNavigation();

    const onShouldStartLoadWithRequest = (request: any) => {
        // Don't load custom scheme URLs in WebView
        if (request.url.startsWith(GRID_HARD_LINK_BASE)) {
            return false;
        }
        return true;
    };

    return (
        <WebView
            source={{uri: REGISTER_URL}}
            style={styles.container}
            onNavigationStateChange={(navState: WebViewNavigationEvent) => handleRegisterRedirect(navState, navigation)}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
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