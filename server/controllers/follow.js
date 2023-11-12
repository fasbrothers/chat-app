import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addFollow(req, res, next) {
	try {
		const id = req.user.id;
		const followingId = req.params.id;

		const userToFollow = await prisma.user.findUnique({
			where: {
				id: followingId,
			},
		});

		if (!userToFollow) {
			return res.status(404).json({ error: 'User not found' });
		}

		if (userToFollow.id === id) {
			return res.status(400).json({ error: 'You cannot follow yourself' });
		}

		await prisma.userFollow.create({
			data: {
				followerId: id,
				followingId: followingId,
			},
		});

		res.status(201).json({ message: 'Followed successfully' });
	} catch (error) {
		next(error);
	}
}

export async function removeFollow(req, res, next) {
	try {
		const id = req.user.id;
		const followingId = req.params.id;

		const userToUnfollow = await prisma.user.findUnique({
			where: {
				id: followingId,
			},
		});

		if (!userToUnfollow) {
			return res.status(404).json({ error: 'User not found' });
		}

		if (userToUnfollow.id === id) {
			return res.status(400).json({ error: 'You cannot unfollow yourself' });
		}

		await prisma.userFollow.delete({
			where: {
				followerId_followingId: {
					followerId: id,
					followingId: followingId,
				},
			},
		});

		res.status(200).json({ message: 'Unfollowed successfully' });
	} catch (error) {
		next(error);
	}
}

export async function getFollowers(req, res, next) {
	try {
		const id = req.user.id;
		const followList = await prisma.userFollow.findMany({
			where: {
				followerId: id,
			},
			select: {
				following: true,
			},
		});

		const followingList = followList.map(follow => {
			return { id: follow.following.id, name: follow.following.name };
		});

		res.status(200).json({ followingList });
	} catch (error) {
		next(error);
	}
}
