export const BACKEND_SERVER_DOMAIN: string = "http://localhost:8000";
export const DEPLOY_DOMAIN: string = "http://localhost:5173";

// Endpoints
export const LOGIN_EP: string = BACKEND_SERVER_DOMAIN + "/api/user/login/";
export const LOGOUT_EP: string = BACKEND_SERVER_DOMAIN + "/api/user/logout/";
export const NEW_NOTE_EP: string = BACKEND_SERVER_DOMAIN + "/api/note/create/";
export const REGISTER_EP: string = BACKEND_SERVER_DOMAIN + "/api/user/register/";
export const NOTE_EP = (note: string): string => {
	return BACKEND_SERVER_DOMAIN + "/api/note/" + note + "/";
};
