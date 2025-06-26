export const KEYCLOAK_BASE_URL =
  "https://sso.getgrid.ai/realms/grid-prod/protocol/openid-connect";
export const CLIENT_ID = "mobile-app"; // 'mobile-app' for mobile apps

export const RANDOM_STATE = "LB3KNqiCdbWisf";
export const CLIENT_SECRET = "EvKvEefP5zUhnzD73cyjJ7L18QNrpIZk";

export const AFTER_REGISTRATION_REDIRECT_URL = "grid://auth";
export const GRID_HARD_LINK_BASE = "grid://";
export const REGISTER_URL = `${KEYCLOAK_BASE_URL}/registrations?client_id=${CLIENT_ID}&response_type=code&scope=openid&redirect_uri=${AFTER_REGISTRATION_REDIRECT_URL}&no-google=1`;
export const AUTH_LINK = `${KEYCLOAK_BASE_URL}/auth?client_id=${CLIENT_ID}
&response_type=code&redirect_uri=${AFTER_REGISTRATION_REDIRECT_URL}&state=${RANDOM_STATE}&scope=openid profile email&no-google=1`;
export const POST_LOGOUT_REDIRECT = `${GRID_HARD_LINK_BASE}Index`;
export const LOGOUT_URL = `${KEYCLOAK_BASE_URL}/logout?client_id=${CLIENT_ID}&post_logout_redirect_uri=${POST_LOGOUT_REDIRECT}`;
export const DASHBOARD_URL = "https://app.getgrid.ai";
export const KEYCLOAK_REGISTRATION_URL = `https://sso.getgrid.ai/registration`;

export const REFERRAL_SERVICE_URL = "https://api.getgrid.ai/referralservice";
export const DASHBOARD_SERVICE_URL = "https://api.getgrid.ai/dashboard";
export const REWARDS_SERVICE_URL = "https://api.getgrid.ai/pointsservice";
export const KEYCLOAK_LOGIN_LINK_FROM_REGISTRATION_PAGE =
  "https://sso.getgrid.ai/realms/grid-prod/login-actions/authenticate";
