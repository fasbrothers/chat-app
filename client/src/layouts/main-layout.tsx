import { Outlet } from 'react-router-dom';
import { Suspense, useState } from 'react';
import { LoadingLazy } from '../components/shared/loading-lazy';
import {
	HeaderMain,
	SidebarInMain,
	SidebarRightMain,
} from '../components/main';
import { useEffect } from 'react';
import { connectSocket, disconnectSocket, socket } from '../api';
import { getFromCookie } from '../utils/cookies';
import { useDataFetching } from '../hooks/useDataFetching';
import { UserResponse } from '../types/user.types';
import {
	NewChat,
	ReceiveListMessages,
	ReceiveMessage,
	setChatMessages,
	setChats,
	setNewChat,
	setNewMessage,
} from '../store/slices/chatSlice';
import { useAppDispatch } from '../hooks/redux-hooks';
import { toastSuccessMessage } from '../utils/toast-message';

export default function MainLayout() {
	const [showNavbar, setShowNavbar] = useState<boolean>(false);
	const token = getFromCookie('token');
	const { data: profile } = useDataFetching<UserResponse>(
		'profile',
		'/user/profile'
	);

	const dispatch = useAppDispatch();

	useEffect(() => {
		connectSocket(token || '');

		socket.on('message', (newMessage: ReceiveMessage) => {
			if (!newMessage.owner) {
				toastSuccessMessage(
					'New message from ' +
						newMessage.sender?.name +
						': ' +
						newMessage.message.content
				);
			}
			dispatch(setNewMessage(newMessage));
		});

		socket.on('new_chat', (newChat: NewChat) => {
			dispatch(setNewChat(newChat));
		});

		socket.on('messages', (messages: ReceiveListMessages) => {
			dispatch(setChatMessages(messages));
		});

		socket.on('conversations', data => {
			dispatch(setChats(data));
		});

		return () => {
			disconnectSocket();
			socket.off('message');
			socket.off('new_chat');
			socket.off('messages');
			socket.off('conversations');
		};
	}, [token, dispatch, profile?.id]);

	return (
		<div className='w-full xl:w-4/5 flex min-h-screen mx-auto'>
			<SidebarInMain
				showNavbar={showNavbar}
				setShowNavbar={setShowNavbar}
				profile={profile as UserResponse}
			/>
			<div
				onClick={() => showNavbar && setShowNavbar(!showNavbar)}
				className={`${
					showNavbar && 'blur-sm'
				} w-full md:w-4/6 lg:w-[46%] px-5 md:px-10 lg:px-20 flex flex-col`}
			>
				<HeaderMain setShowNavbar={setShowNavbar} showNavbar={showNavbar} />
				<Suspense fallback={<LoadingLazy />}>
					<div className='grow'>
						<Outlet />
					</div>
				</Suspense>
			</div>
			<SidebarRightMain />
		</div>
	);
}
