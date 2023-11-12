import { Component, ErrorInfo } from 'react';
import {
	ErrorBoundaryProps,
	ErrorBoundaryState,
} from '../../@types/error.types';

export default class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.log(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback;
		} else {
			return this.props.children;
		}
	}
}
