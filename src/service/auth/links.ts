export const KEYCLOAK_BASE_URL = "https://sso.getgrid.ai/realms/grid-prod/protocol/openid-connect"
export const CLIENT_ID = "desktop-app" // 'mobile-app' for mobile apps
export const RANDOM_STATE = "LB3KNqiCdbWisf"
export const CLIENT_SECRET = "uQrGkzF7xycloCmeSWxtuE9oUYhzUF6D"
export const REDIRECT_URI = "grid://auth"
export const REGISTER_URL = "https://sso.getgrid.ai/registration"

export const AUTH_LINK = `${KEYCLOAK_BASE_URL}/auth?client_id=${CLIENT_ID}
&response_type=code&redirect_uri=${REDIRECT_URI}&state=${RANDOM_STATE}&scope=openid profile email`