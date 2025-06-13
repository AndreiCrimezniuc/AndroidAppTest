import {StyleSheet} from "react-native";
import WebView from 'react-native-webview';
import Constants from 'expo-constants';
import {WebViewNavigationEvent} from "react-native-webview/lib/RNCWebViewNativeComponent";
import React from "react";
import {REGISTER_URL} from "../../service/auth/links";
import {handleLoginRedirect} from "../../service/auth/auth";
import {useNavigation} from "@react-navigation/native";

export const RegisterWebView = () => {
    const navigation = useNavigation();

    return (
        <WebView
            source={{uri: REGISTER_URL}}
            style={styles.container}
            onNavigationStateChange={(navState: WebViewNavigationEvent) => handleLoginRedirect(navState, navigation)}
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