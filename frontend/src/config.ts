// export const BACKEND_SERVER_DOMAIN: string = "http://localhost:8000";
// export const DEPLOY_DOMAIN: string = "http://localhost:3000";
export const BACKEND_SERVER_DOMAIN: string = "https://api.letsnote.io";
export const DEPLOY_DOMAIN: string = "https://letsnote.io";

// Endpoints
export const LOGIN_EP: string = BACKEND_SERVER_DOMAIN + "/api/user/login/";
export const LOGOUT_EP: string = BACKEND_SERVER_DOMAIN + "/api/user/logout/";
export const NEW_NOTE_EP: string = BACKEND_SERVER_DOMAIN + "/api/note/create/";
export const NOTE_EP = (note: string): string => {
	return BACKEND_SERVER_DOMAIN + "/api/note/" + note + "/";
};
