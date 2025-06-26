import { StyleSheet } from "react-native";
import WebView, { WebViewNavigation } from "react-native-webview";
import Constants from "expo-constants";
import React from "react";
import { AUTH_LINK } from "../../service/links";
import { handleLoginRedirect } from "../../service/auth/auth";
import { useAuth } from "../../service/auth/useAuth";

export const LoginWebView = () => {
  const { setToken } = useAuth();

  const handleNavChange = (navState: WebViewNavigation) => {
    handleLoginRedirect(navState, setToken).catch((error) => {
      console.error("Login redirect error:", error);
    });
  };

  return (
    <WebView
      source={{ uri: AUTH_LINK }}
      style={styles.container}
      onNavigationStateChange={handleNavChange}
      startInLoadingState={true}
      thirdPartyCookiesEnabled={true}
      sharedCookiesEnabled={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onError={(syntheticEvent: { nativeEvent: any }) => {
        const { nativeEvent } = syntheticEvent;
        console.error("WebView error: ", nativeEvent);
      }}
      onHttpError={(syntheticEvent: { nativeEvent: any }) => {
        const { nativeEvent } = syntheticEvent;
        console.error("HTTP error: ", nativeEvent);
      }}
      setSupportMultipleWindows={true}
    />
  );
};

//this style is mandatory for the webview to be displayed
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
