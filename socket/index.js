import 'dotenv/config.js';
import http from 'http';
import { Server } from 'socket.io';
import pool from './postgres/index.js';
import verifyToken from './utils/verifyToken.js';
import jwt from 'jsonwebtoken';

const server = http.createServer();
const io = new Server(server, {
	cors: { origin: '*' },
});
const port = 8082;

const userSocketMap = new Map();

io.use(function (socket, next) {
	if (socket.handshake.auth) {
		jwt.verify(
			socket.handshake.auth.token,
			process.env.JWT_SECRET,
			function (err, decoded) {
				if (err) return next(new Error('Authentication error'));
				socket.decoded = decoded;
				next();
			}
		);
	} else {
		console.log('No token');
	}
});

io.on('connection', socket => {
	userSocketMap.set(socket.decoded.id, socket.id);

	socket.on('get_conversations', async ({ jwtToken }) => {
		const userId = verifyToken(jwtToken);

		if (!userId) {
			console.error('Unauthorized access');
			return;
		}

		const conversations = await pool.query(
			`SELECT uc.*, c.id AS "conversationId", u.id AS "receiverId", u.name AS "receiverName"
			FROM "userConversation" uc
			JOIN conversation c ON uc."conversationId" = c.id
			JOIN "user" u ON uc."receiverId" = u.id
			WHERE uc."userId" = $1`,
			[userId]
		);

		socket.emit('conversations', conversations.rows);
	});

	socket.on('new_chat', async data => {
		const { sender, receiverId, content } = data;
		const userId = verifyToken(sender);

		if (!userId) {
			console.error('Unauthorized access');
			return;
		}

		const conversation = await findOrCreateConversation(userId, receiverId);

		try {
			const messages = (
				await pool.query(
					'INSERT INTO message (content, "senderId", "conversationId", "createdAt") VALUES ($1, $2, $3, NOW()) RETURNING *',
					[content, userId, conversation.id]
				)
			).rows;

			const sender = (
				await pool.query('SELECT id, name FROM "user" WHERE id = $1', [userId])
			).rows[0];

			const receiver = (
				await pool.query('SELECT id, name FROM "user" WHERE id = $1', [
					receiverId,
				])
			).rows[0];

			io.to(userSocketMap.get(receiverId)).emit('new_chat', {
				conversationId: conversation.id,
				receiverId: sender.id,
				receiverName: sender.name,
				messages,
			});
			socket.emit('new_chat', {
				conversationId: conversation.id,
				receiverId: receiver.id,
				receiverName: receiver.name,
				messages,
			});
		} catch (err) {
			console.error('Error while saving the message to the database:', err);
		}
	});

	socket.on('get_messages', async ({ token, receiverId }) => {
		const userId = verifyToken(token);

		if (!userId) {
			console.error('Unauthorized access');
			return;
		}

		const messages = await pool.query(
			`SELECT m.*
			FROM "userConversation" uc 
			JOIN "message" m ON m."conversationId" = uc."conversationId"
			WHERE uc."userId" = $1 AND uc."receiverId" = $2`,
			[userId, receiverId]
		);

		socket.emit('messages', { receiverId, messages: messages.rows });
	});

	socket.on('message', async data => {
		const { sender, content, receiverId } = data;

		const userId = verifyToken(sender);

		if (!userId) {
			console.error('Unauthorized access');
			return;
		}

		try {
			const result = await pool.query(
				'INSERT INTO message (content, "senderId", "conversationId", "createdAt") VALUES ($1, $2, (SELECT "conversationId" FROM "userConversation" WHERE "userId" = $2 AND "receiverId" = $3), NOW()) RETURNING *',
				[content, userId, receiverId]
			);

			const senderDetails = await pool.query(
				'SELECT id, name FROM "user" WHERE id = $1',
				[userId]
			);

			const receiverDetails = (
				await pool.query('SELECT id, name FROM "user" WHERE id = $1', [
					receiverId,
				])
			).rows[0];

			const message = result.rows[0];

			socket.emit('message', {
				owner: true,
				message,
			});
			socket.to(userSocketMap.get(receiverDetails.id)).emit('message', {
				sender: senderDetails.rows[0],
				message,
			});
		} catch (err) {
			console.error('Error while saving the message to the database:', err);
		}
	});

	socket.on('disconnect', () => {
		userSocketMap.delete(getUserIdBySocketId(socket.id));
		console.log('A user disconnected');
	});
});

server.listen(port, () => console.log(`Server is listening on port ${port}`));

async function findOrCreateConversation(user1Id, user2Id) {
	const existingConversation = await pool.query(
		'SELECT * FROM conversation WHERE id IN (' +
			'  SELECT "conversationId" FROM "userConversation" WHERE "userId" = $1' +
			') AND id IN (' +
			'  SELECT "conversationId" FROM "userConversation" WHERE "userId" = $2' +
			')',
		[user1Id, user2Id]
	);

	if (existingConversation.rows.length > 0) {
		return existingConversation.rows[0];
	}

	const newConversation = await pool.query(
		'INSERT INTO conversation default values RETURNING *'
	);

	await pool.query(
		'INSERT INTO "userConversation" ("userId", "conversationId", "receiverId") VALUES ($1, $2, $3), ($3, $2, $1)',
		[user1Id, newConversation.rows[0].id, user2Id]
	);

	return newConversation.rows[0];
}

function getUserIdBySocketId(socketId) {
	for (const [userId, id] of userSocketMap.entries()) {
		if (id === socketId) {
			return userId;
		}
	}
	return null;
}
