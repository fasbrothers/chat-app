export interface InputValues {
	password: string;
	email: string;
	name: string;
}

export interface AuthProps {
	mutate: (values: InputValues) => void;
	isLoading: boolean;
}

export interface AuthResponse {
	token: string;
}
