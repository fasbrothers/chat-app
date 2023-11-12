import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Message {
	id: string;
	content: string;
	senderId: string;
	conversationId: string;
	createdAt: string;
}

export interface NewChat {
	conversationId: string;
	receiverId: string;
	receiverName: string;
	messages: Message[];
}

interface User {
	id: string;
	name: string;
}

interface Chat {
	id?: string;
	userId?: string;
	receiverId: string;
	conversationId: string;
	createdAt?: string;
	receiverName: string;
	messages: Message[];
}

export interface ReceiveMessage {
	message: Message;
	owner?: boolean;
	sender?: User;
}

export interface ReceiveListMessages {
	receiverId: string;
	messages: Message[];
}

interface InitialState {
	chatList: Chat[] | undefined;
	currentChat: { receiverId: string } | undefined;
}

const initialState: InitialState = {
	chatList: undefined,
	currentChat: undefined,
};

export const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setChats: (state, action: PayloadAction<Chat[]>) => {
			state.chatList = action.payload;
		},
		setNewChat: (state, action: PayloadAction<Chat>) => {
			state.chatList?.push(action.payload);
		},

		setCurrentChat: (state, action: PayloadAction<{ receiverId: string }>) => {
			state.currentChat = action.payload;
		},

		setChatMessages: (state, action: PayloadAction<ReceiveListMessages>) => {
			const { receiverId, messages } = action.payload;

			state.chatList = state.chatList?.map(chat => {
				if (chat.receiverId === receiverId) {
					return { ...chat, messages };
				}

				return chat;
			});
		},
		setNewMessage: (state, action: PayloadAction<ReceiveMessage>) => {
			const { message } = action.payload;

			state.chatList = state.chatList?.map(chat => {
				if (chat.conversationId === message.conversationId) {
					chat.messages.push(message);
					return chat;
				}
				return chat;
			});
		},
	},
});

export const {
	setChats,
	setChatMessages,
	setCurrentChat,
	setNewChat,
	setNewMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
