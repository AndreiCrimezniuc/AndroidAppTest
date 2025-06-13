import { parseUrl } from 'query-string';
import {AUTH_LINK, CLIENT_ID, CLIENT_SECRET, KEYCLOAK_BASE_URL, REDIRECT_URI} from "./links";

// @ts-ignore
export const handleRegisterRedirect = (navState: any) => {
    //toDO
}

export const handleLoginRedirect = (navState: any, navigation: any) => {
    try {
        console.log("Retrieving bearer after redirect ...")
        const { url } = navState;
        const { query } = parseUrl(url);

        const authCode = query.code as string;

        if (authCode) {
            fetchBearerToken(authCode)
                .then(()=> {
                    console.log("Bearer token retrieved successfully")
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
    tokenParams.append("redirect_uri", REDIRECT_URI);

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