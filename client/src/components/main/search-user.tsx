import { Button, Input } from 'antd';
import { httpClient } from '../../api';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toastSuccessMessage } from '../../utils/toast-message';
import { useDebounse } from '../../hooks/useDebounce';
import { FollowingList, FollowingsResponse } from '../../types/user.types';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

export const SearchUser = ({
	followings,
}: {
	followings: FollowingsResponse;
}) => {
	const [searchValue, setSearchValue] = useState<string>('');
	const [searchResult, setSearchResult] = useState([]);
	const debouncedSearchTerm = useDebounse(searchValue);

	const loadUsers = async () => {
		const { data } = await httpClient.post('/user/search', {
			name: debouncedSearchTerm,
		});

		setSearchResult(data);
	};

	useEffect(() => {
		if (debouncedSearchTerm) {
			loadUsers();
		} else {
			setSearchResult([]);
		}
	}, [debouncedSearchTerm]);

	const queryClient = useQueryClient();

	const { mutate: mutateFollow, isLoading: isLoadingFollow } = useMutation({
		mutationFn: async (id: string) => {
			await httpClient.post(`/user/followers/${id}`);
		},
		onSuccess: () => {
			toastSuccessMessage('Followed successfully');
			queryClient.invalidateQueries(['followings']);
		},
	});

	const { mutate: mutateUnFollow, isLoading: isLoadingUnFollow } = useMutation({
		mutationFn: async (id: string) => {
			await httpClient.delete(`/user/followers/${id}`);
		},
		onSuccess: () => {
			toastSuccessMessage('Unfollowed successfully');
			queryClient.invalidateQueries(['followings']);
		},
	});
	return (
		<div className='mb-5'>
			<Input
				placeholder='Search a user'
				value={searchValue}
				onChange={e => setSearchValue(e.target.value)}
				className='input__style rounded-lg'
				prefix={<SearchIcon className='text-gray-500' />}
			/>
			<div className='bg-gray-50 rounded-lg'>
				{searchResult.length > 0 &&
					searchResult.map((user: { id: string; name: string }) => (
						<div
							className='flex justify-between gap-x-2 items-center p-2 hover:bg-gray-100'
							key={user.id}
						>
							<p className='p-2'>{user.name}</p>
							{followings &&
							followings?.followingList.some(
								(following: FollowingList) => following.id === user.id
							) ? (
								<Button
									loading={isLoadingUnFollow}
									onClick={() => mutateUnFollow(user.id)}
								>
									<PersonRemoveIcon className='text-gray-500' />
								</Button>
							) : (
								<Button
									loading={isLoadingFollow}
									onClick={() => mutateFollow(user.id)}
								>
									<PersonAddIcon className='text-gray-500' />
								</Button>
							)}
						</div>
					))}
			</div>
		</div>
	);
};
