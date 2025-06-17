import { parseUrl } from 'query-string';
import {AUTH_LINK, CLIENT_ID, CLIENT_SECRET, KEYCLOAK_BASE_URL, AFTER_REGISTRATION_REDIRECT_URL} from "../links";
import { tokenStorage } from '../storage/tokenStorage';

// @ts-ignore
export const handleRegisterRedirect = (navState: any,  navigation: any) => {
    const { url } = navState;

    if (url && url.startsWith(AFTER_REGISTRATION_REDIRECT_URL)) {
        try {
            const urlObj = new URL(url);
            const code = urlObj.searchParams.get('code');
            const error = urlObj.searchParams.get('error');

            if (error) {
                console.error('Authentication error:', error);
                //toDo: handle error appropriately, e.g., show an alert
                return;
            }

            if (code) {
                console.log('Authorization code received:', code);

                fetchBearerToken(code).then(() => {
                    navigation.navigate('Login');
                }).catch((error) => {
                    console.error('Token exchange failed:', error);
                });
            }
        } catch (error) {
            console.error('Error parsing redirect URL:', error);
        }
    }
};

export const handleLoginRedirect = (navState: any, navigation: any) => {
    try {
        console.log("Retrieving bearer after redirect ...")
        const { url } = navState;
        const { query } = parseUrl(url);

        const authCode = query.code as string;

        if (authCode) {
            fetchBearerToken(authCode)
                .then(async (token) => {
                    console.log("Bearer token retrieved successfully");
                    await tokenStorage.saveToken(token);
                    navigation.navigate("Home");
                }).catch((error) => {
                    console.error("Bearer token retrieval failed. " + error.toString())
                });
        }
    } catch (error) {
       console.error("cannot retrieve bearer token from keycloak")
    }
};

const fetchBearerToken = async (authCode: string): Promise<string> => {
    const tokenEndpoint = KEYCLOAK_BASE_URL + '/token';

    const tokenParams = new URLSearchParams();
    tokenParams.append("grant_type", "authorization_code");
    tokenParams.append("client_id", CLIENT_ID);
    tokenParams.append("client_secret", CLIENT_SECRET);
    tokenParams.append("code", authCode);
    tokenParams.append("redirect_uri", AFTER_REGISTRATION_REDIRECT_URL);

    console.log("Token request params: ", tokenParams.toString());
    console.log("Auth Code received:", authCode);

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenParams.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error('Token exchange failed: Response text:'  + errorText);
    }

    //toDo: So token, but when should we put it?

    const tokenData = await response.json();

    return tokenData.access_token;
};