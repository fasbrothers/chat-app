import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toastMessage from '../utils/toast-message';
import { httpClient } from '../api';
import { ErrorResponse } from '../types/error.types';

export const useDataFetching = <T,>(
	key: string,
	url: string,
	dependency?: string
) => {
	return useQuery<T, AxiosError<ErrorResponse>>(
		[key, dependency],
		async () => {
			const { data } = await httpClient.get<T>(url);
			return data;
		},
		{
			onError: error => {
				toastMessage(
					error?.response?.data.message || error?.message || 'Error'
				);
			},
		}
	);
};
