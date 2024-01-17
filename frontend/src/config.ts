export const BACKEND_SERVER_DOMAIN: string = import.meta.env.VITE_BACKEND_BASE_URL;
export const DEPLOY_DOMAIN: string = import.meta.env.VITE_FRONTEND_BASE_URL;

// Endpoints
export const LOGIN_EP: string = BACKEND_SERVER_DOMAIN + "/api/user/login/";
export const LOGOUT_EP: string = BACKEND_SERVER_DOMAIN + "/api/user/logout/";
export const NEW_NOTE_EP: string = BACKEND_SERVER_DOMAIN + "/api/note/create/";
export const REGISTER_EP: string = BACKEND_SERVER_DOMAIN + "/api/user/register/";
export const NOTE_EP = (note: string): string => {
	return BACKEND_SERVER_DOMAIN + "/api/note/" + note + "/";
};
