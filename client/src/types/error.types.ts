import { ReactNode } from 'react';

export interface ErrorResponse {
	message: string;
	status: number;
	type: string;
}

export interface ErrorBoundaryProps {
	fallback: ReactNode;
	children: ReactNode;
}

export interface ErrorBoundaryState {
	hasError: boolean;
}
