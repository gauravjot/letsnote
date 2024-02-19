export interface UserType {
	id: string;
	name: string;
	email: string;
	verified: boolean;
}

export interface UserToken {
	token: string;
}

export interface ApiUserType extends UserToken {
	user: UserType;
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
