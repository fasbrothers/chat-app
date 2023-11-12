import express from 'express';
import {
	registerUser,
	loginUser,
	getUser,
	searchUser,
} from '../controllers/user.js';
import { createPost, getPost, getPosts } from '../controllers/post.js';
import {
	addFollow,
	getFollowers,
	removeFollow,
} from '../controllers/follow.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// user
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getUser);
router.post('/search', verifyToken, searchUser);

// post
router.get('/getPosts', verifyToken, getPosts);
router.get('/getPosts/:id', verifyToken, getPost);
router.post('/createPost', verifyToken, createPost);

// follow
router.post('/followers/:id', verifyToken, addFollow);
router.delete('/followers/:id', verifyToken, removeFollow);
router.get('/followers', verifyToken, getFollowers);

export default router;
