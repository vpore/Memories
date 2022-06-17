import express from 'express';
import {getPosts, getPostsBySearch, createPost, updatePost, likePost, deletePost} from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/search', getPostsBySearch);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.patch('/:id/likePost', auth, likePost);
router.delete('/:id', auth, deletePost);

export default router;