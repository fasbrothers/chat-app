import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/error-boundary/error-boundary.tsx';
import { LoadingLazy } from './components/shared/loading-lazy.tsx';
import { Suspense } from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ErrorBoundary fallback='There was an error'>
			<Suspense fallback={<LoadingLazy />}>
				<App />
			</Suspense>
		</ErrorBoundary>
	</React.StrictMode>
);
