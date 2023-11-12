import { PrismaClient } from '@prisma/client';
import LIVR from 'livr';

const prisma = new PrismaClient();

export async function createPost(req, res, next) {
	try {
		const validator = new LIVR.Validator({
			title: ['required', 'string', 'trim', { min_length: 2 }],
			content: ['required', 'string', 'trim', { min_length: 6 }],
		});

		const { title, content } = req.body;
		const validData = validator.validate(req.body);

		if (!validData) {
			return res.status(400).json({ error: validator.getErrors() });
		}

		const post = await prisma.post.create({
			data: {
				title,
				content,
				author: {
					connect: {
						id: req.user.id,
					},
				},
			},
		});

		res.status(201).json(post);
	} catch (error) {
		next(error);
	}
}

export async function getPosts(req, res, next) {
	try {
		const posts = await prisma.post.findMany({
			where: {
				authorId: req.user.id,
			},
		});
		res.json(posts);
	} catch (error) {
		next(error);
	}
}

export async function getPost(req, res, next) {
	try {
		const id = req.params.id;
		const post = await prisma.post.findUnique({
			where: {
				id: id,
			},
		});
		if (post.authorId !== req.user.id) {
			res.statusCode = 401;
			throw new Error('Unauthorized');
		}
		res.json(post);
	} catch (error) {
		next(error);
	}
}
