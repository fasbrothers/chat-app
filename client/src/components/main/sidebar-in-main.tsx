import ClearIcon from '@mui/icons-material/Clear';
import { Button, Dropdown, Spin, Tooltip } from 'antd';
import {
	FollowingList,
	FollowingsResponse,
	SidebarInMainProps,
} from '../../types/user.types';
import { useDataFetching } from '../../hooks/useDataFetching';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../../api';
import { toastSuccessMessage } from '../../utils/toast-message';
import { SearchUser } from '.';
import { useNavigate } from 'react-router-dom';
import { removeFromCookie } from '../../utils/cookies';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { MenuProps } from 'antd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useAppDispatch } from '../../hooks/redux-hooks';
import { setCurrentChat } from '../../store/slices/chatSlice';

export const SidebarInMain = ({
	showNavbar,
	setShowNavbar,
	profile,
}: SidebarInMainProps) => {
	const { isLoading, data: followings } = useDataFetching<FollowingsResponse>(
		'followings',
		'/user/followers'
	);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const dispatch = useAppDispatch();

	const handleClick = (id: string) => {
		mutate(id);
	};
	const query = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: async (id: string) => {
			await httpClient.delete(`/user/followers/${id}`);
		},
		onSuccess: () => {
			toastSuccessMessage('Unfollowed successfully');
			query.invalidateQueries(['followings']);
		},
	});

	const sendMessage = (id: string) => {
		navigate(`/main/messages/${id}`);
		dispatch(setCurrentChat({ receiverId: id }));
	};

	const handleLogout = () => {
		removeFromCookie('token');
		queryClient.removeQueries();
		navigate('/auth/login');
	};

	const items: MenuProps['items'] = [
		{
			key: '1',
			label: <button onClick={() => handleLogout()}>Logout</button>,
		},
	];

	return (
		<div
			className={`${
				showNavbar ? 'fixed w-2/3 sm:w-2/5 z-30' : 'hidden'
			} md:block md:w-2/6 lg:w-[27%] bg-white border-r border-gray-200 px-4 lg:px-8 h-screen md:sticky top-0 `}
		>
			{showNavbar && (
				<Button
					className='border-none shadow-none absolute top-1 right-0'
					onClick={() => setShowNavbar(!showNavbar)}
				>
					<ClearIcon />
				</Button>
			)}
			<div className='h-screen pt-10 flex flex-col'>
				<SearchUser followings={followings as FollowingsResponse} />
				<h5 className={`font-bold text-lg mb-4`}>Followings</h5>
				<div className='grow'>
					<ul>
						{isLoading ? (
							<Spin />
						) : (
							followings?.followingList.map((user: FollowingList) => (
								<div key={user.id} className='cursor-pointer my-2'>
									<div className='flex items-center justify-between border-none shadow-none gap-x-2 p-4 hover:bg-gray-100 hover:rounded-xl'>
										<div onClick={() => sendMessage(user.id)} className='grow'>
											<Tooltip
												title='Send message'
												trigger='hover'
												className='flex gap-x-2 items-center'
												placement='top'
												color='gray'
											>
												<AccountCircleIcon
													className='text-gray-600'
													fontSize='large'
												/>
												<h4 className='text-lg font-bold'>{user.name}</h4>
											</Tooltip>
										</div>
										<Button
											loading={isLoading}
											onClick={() => handleClick(user.id)}
										>
											<PersonRemoveIcon className='text-gray-500' />
										</Button>
									</div>
								</div>
							))
						)}
						{followings?.followingList.length === 0 && (
							<h4 className='text-md'>No followings</h4>
						)}
					</ul>
				</div>
				<div className='pb-4 flex justify-between mb-4 hover:bg-gray-100 hover:rounded-xl py-4 pl-4'>
					{profile && (
						<>
							<div>
								<div className='flex gap-2 items-center'>
									<AccountCircleIcon
										fontSize='large'
										className='text-gray-700'
									/>
									<h4 className='text-md font-bold capitalize'>{profile.name}</h4>
								</div>
								<p className='text-xs'>{profile.email}</p>
							</div>
							<div>
								<Dropdown menu={{ items }} placement='topLeft'>
									<Button className='flex items-center border-none shadow-none'>
										<MoreVertIcon />
									</Button>
								</Dropdown>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
