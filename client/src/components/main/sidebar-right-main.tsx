import { useEffect } from 'react';
import { socket } from '../../api';
import { getFromCookie } from '../../utils/cookies';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getUserId } from '../../utils/getUserId';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { setCurrentChat } from '../../store/slices/chatSlice';

export const SidebarRightMain = () => {
	const navigate = useNavigate();
	const userId = getUserId();
	const dispatch = useAppDispatch();

	const conversations = useAppSelector(state => state.chat.chatList) || [];

	useEffect(() => {
		socket.emit('get_conversations', {
			jwtToken: getFromCookie('token'),
		});
	}, [userId]);

	const sendMessage = (id: string) => {
		navigate(`/main/messages/${id}`);
		dispatch(setCurrentChat({ receiverId: id }));
	};

	return (
		<div className='fixed hidden z-30 lg:block lg:w-[27%] border-l border-gray-200 pl-4 lg:pl-8 h-screen md:sticky top-0'>
			<div className='h-screen pt-10 pr-2'>
				<h5 className={`font-bold text-lg mb-4`}>Chats</h5>
				<div>
					{conversations.length > 0 ? (
						conversations.map(conversation => (
							<div
								key={conversation.id}
								onClick={() => sendMessage(conversation.receiverId)}
								className='flex gap-x-2 mt-2 items-center justify-between p-4 hover:bg-gray-100 hover:rounded-xl cursor-pointer'
							>
								<h4 className='text-lg font-bold'>
									{conversation.receiverName}
								</h4>
								<Button>
									<EmailOutlinedIcon className='text-gray-400' />
								</Button>
							</div>
						))
					) : (
						<h4 className='text-lg font-bold'>No chats</h4>
					)}
				</div>
			</div>
		</div>
	);
};
