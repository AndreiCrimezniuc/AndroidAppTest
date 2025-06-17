import {useNavigation} from "@react-navigation/native";
import { WebView } from "react-native-webview"; // ✅ named import
import {LOGOUT_URL, POST_LOGOUT_REDIRECT} from "../../service/links";
import {NavigationProp} from "../../service/navigation";

export const LogoutWebView = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleNavigationChange = (navState: any) => {
        if (navState.url.startsWith(POST_LOGOUT_REDIRECT)) {
            console.log("Redirect detected, logout complete");
            navigation.reset({
                index: 0,
                routes: [{ name: "Index" }],
            });
        }
    };
    return (
        <WebView
            source={{ uri: LOGOUT_URL }}
            onNavigationStateChange={handleNavigationChange}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
        />
    );
};
