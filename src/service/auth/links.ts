export const KEYCLOAK_BASE_URL = "https://sso.getgrid.ai/realms/grid-prod/protocol/openid-connect"
export const CLIENT_ID = "desktop-app" // 'mobile-app' for mobile apps
export const RANDOM_STATE = "LB3KNqiCdbWisf"
export const CLIENT_SECRET = "uQrGkzF7xycloCmeSWxtuE9oUYhzUF6D"
export const AFTER_REGISTRATION_REDIRECT_URL = "grid://auth"
export const GRID_HARD_LINK_BASE = "grid://"
export const REGISTER_URL = `${KEYCLOAK_BASE_URL}/registration?client_id=${CLIENT_ID}&response_type=code&scope=openid&redirect_uri=${AFTER_REGISTRATION_REDIRECT_URL}`
export const AUTH_LINK = `${KEYCLOAK_BASE_URL}/auth?client_id=${CLIENT_ID}
&response_type=code&redirect_uri=${AFTER_REGISTRATION_REDIRECT_URL}&state=${RANDOM_STATE}&scope=openid profile email`