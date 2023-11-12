import { FormEvent, useEffect, useState } from 'react';
import { socket } from '../../api';
import { Input } from 'antd';
import { ButtonPrimary } from '../../components/shared/button';
import { getFromCookie } from '../../utils/cookies';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { getUserId } from '../../utils/getUserId';
import { useAppSelector } from '../../hooks/redux-hooks';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRef } from 'react';

function Messages() {
	const id = useLocation().pathname.split('/')[3];
	const [message, setMessage] = useState<string>('');
	const [receiverId, setReceiverId] = useState(id);
	const messageEl = useRef<HTMLDivElement>(null);

	const userId = getUserId();
	const token = getFromCookie('token');
	dayjs.extend(relativeTime);

	const messages = useAppSelector(
		state => state.chat.chatList?.find(chat => chat.receiverId === id)?.messages
	);

	const sendMessage = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		socket.emit(messages ? 'message' : 'new_chat', {
			sender: token,
			receiverId,
			content: message,
		});
		setMessage('');
	};
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		if (messageEl.current) {
			messageEl.current.scrollTop = messageEl.current.scrollHeight;
		}
	};

	useEffect(() => {
		if (messages?.length === 0 || messages === undefined) {
			socket.emit('get_messages', {
				token,
				receiverId,
			});
		}
		setReceiverId(id);
	}, [id, userId, token, receiverId, messages]);

	return (
		<div>
			<div ref={messageEl} style={{ height: '90vh', overflowY: 'hidden' }}>
				{messages?.map(msg => (
					<div key={msg.id}>
						{msg.senderId === userId ? (
							<div className='flex justify-end my-2'>
								<div className='bg-blue-500 text-white p-2 rounded-md'>
									<h4>{msg.content}</h4>
									<p className='text-xs'>{dayjs(msg.createdAt).fromNow()}</p>
								</div>
							</div>
						) : (
							<div className='flex justify-start my-2'>
								<div className='bg-gray-200 text-black p-2 rounded-md'>
									<h4>{msg.content}</h4>
									<p className='text-xs'>{dayjs(msg.createdAt).fromNow()}</p>
								</div>
							</div>
						)}
					</div>
				))}
			</div>
			<div className='sticky bottom-0 py-5 z-10 bg-white'>
				<form onSubmit={e => sendMessage(e)} className=' flex mx-auto gap-x-3'>
					<Input
						type='text'
						value={message}
						onChange={e => setMessage(e.target.value)}
					/>
					<ButtonPrimary title='Send' weight='w-[100px]' />
				</form>
			</div>
		</div>
	);
}

export default Messages;
