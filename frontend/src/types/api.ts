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
	active: boolean;
}

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
