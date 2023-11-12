import { BrowserRouter } from 'react-router-dom';
import {
	QueryClient,
	QueryClientProvider,
	MutationCache,
} from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes } from './routes';
import toastMessage from './utils/toast-message';
import { ErrorResponse } from './types/error.types';
import { AxiosError } from 'axios';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000 * 5,
				refetchOnWindowFocus: false,
			},
		},
		mutationCache: new MutationCache({
			onError: error => {
				const axiosError = error as AxiosError<ErrorResponse>;
				toastMessage(
					axiosError.response?.data.message || axiosError.message || 'Error'
				);
			},
		}),
	});

	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<Routes />
					<ToastContainer style={{ width: '400px' }} />
				</Provider>
			</QueryClientProvider>
		</BrowserRouter>
	);
}

export default App;
