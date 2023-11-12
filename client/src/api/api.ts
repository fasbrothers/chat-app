import axios, { AxiosResponse } from 'axios';
import { getFromCookie, removeFromCookie } from '../utils/cookies';

export const httpClient = axios.create({
	baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

httpClient.interceptors.request.use(
	function (config) {
		const token = getFromCookie('token');
		config.headers.Authorization = token ? token : undefined;
		return config;
	},
	function (error) {
		console.log('error');
		return Promise.reject(error);
	}
);

httpClient.interceptors.response.use(
	function (response: AxiosResponse) {
		return response;
	},
	function (error) {
		if (error.response.status === 401) {
			removeFromCookie('token');
			window.location.href = '/auth';
		}
		return Promise.reject(error);
	}
);
