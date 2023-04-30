export interface NoteType {
	id: string;
	user: string;
	title: string;
	content: string;
	created: string;
	updated: string;
}

export interface ShareNote {
	id: string;
	title: string;
	created: string;
	anonymous: boolean;
}

export interface UserType {
	id: string;
	full_name: string;
	email: string;
	email_verified: boolean;
}

export interface UserToken {
	token: string;
}

export interface ApiUserType extends UserToken {
	user: UserType;
}
