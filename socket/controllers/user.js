import pool from '../postgres/index.js';

export async function getConvertations(req, res, next) {
	try {
		const id = req.user.id;

		console.log('id', id);
		const conversations = await pool.query(
			'SELECT * FROM conversation WHERE "senderId" = $1 OR "receiverId" = $1',
			[id]
		);

		res.status(200).json({ conversations });
	} catch (error) {
		next(error);
	}
}
