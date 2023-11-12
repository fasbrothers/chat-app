import { PrismaClient } from '@prisma/client';
import LIVR from 'livr';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function registerUser(req, res, next) {
	try {
		const validator = new LIVR.Validator({
			email: ['required', 'email', 'trim'],
			password: ['required', { min_length: 6 }, 'trim', 'string'],
			name: ['required', { min_length: 2 }, 'trim', 'string'],
		});

		const { email, password, name } = req.body;
		const validData = validator.validate(req.body);

		if (!validData) {
			return res.status(400).json({ error: validator.getErrors() });
		}

		const userExists = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (userExists) {
			res.statusCode = 400;
			throw new Error('User already exists');
		}
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		const user = await prisma.user.create({
			data: {
				email,
				password: hash,
				name,
			},
		});

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: '3h', // 3 hour
		});

		res.status(201).json({ token });
	} catch (error) {
		next(error);
	}
}

export async function loginUser(req, res, next) {
	try {
		const validator = new LIVR.Validator({
			email: ['required', 'email', 'trim'],
			password: ['required', 'string', 'trim'],
		});

		const { email, password } = req.body;
		const validData = validator.validate(req.body);

		if (!validData) {
			return res.status(400).json({ error: validator.getErrors() });
		}

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			res.statusCode = 400;
			throw new Error('User does not exist');
		}

		const isMatch = bcrypt.compareSync(password, user.password);

		if (!isMatch) {
			res.statusCode = 400;
			throw new Error('Invalid password');
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: '3h', // 3 hour
		});

		res.status(200).json({ token });
	} catch (error) {
		next(error);
	}
}

export async function getUser(req, res, next) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.user.id,
			},
			select: {
				id: true,
				email: true,
				name: true,
			},
		});

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
}

export async function searchUser(req, res, next) {
	try {
		const { name } = req.body;

		const users = await prisma.user.findMany({
			where: {
				name: {
					startsWith: name,
					mode: 'insensitive',
				},
				id: {
					not: req.user.id,
				},
			},
			select: {
				id: true,
				name: true,
			},
		});

		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
}
