export interface UserType {
	id: string;
	name: string;
	email: string;
	verified: boolean;
	created: string;
	updated: string;
	password_updated: string;
}

export interface UserSession {
	token: string;
	session: number;
}

export interface UserSessionType {
	id: number;
	user: string;
	expire: number;
	valid: boolean;
	created: string;
	ip: string;
	ua: string;
}
