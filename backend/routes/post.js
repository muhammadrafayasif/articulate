import Post from '../models/Post.js';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        if (!req.query || Object.keys(req.query).length === 0){
            const posts = await Post.find().sort({ createdAt: -1 });
            return res.status(200).json(posts);
        } else {
            const post = await Post.find({ _id: req.query.id });
            if (post.length > 0) {
                return res.status(200).json(post[0]);
            } else {
                return res.status(404).json({ error: 'Post not found.' });
            }
        }
    } catch (err){
        return res.status(400).json({ error: 'Could not fetch posts.' });
    }
});

router.post('/new', async (req, res) => {
    if (req.session?.user?.id){
        try {
            const { title, content } = req.body;
            const newPost = new Post({ title, content, posted_by: req.session.user.name });
            await newPost.save();
            
            return res.status(200).json(newPost);
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    } else {
        return res.status(400).json({error: 'Access denied. Sign in to post!'})
    }
});

router.delete('/:id', async (req, res) => {
    if (req.session?.user?.id){
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ error: 'Post not found.' });
            }
            if (post.posted_by !== req.session.user.name) {
                return res.status(403).json({ error: 'You can only delete your own posts.' });
            }
            await Post.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: 'Post deleted successfully.' });
        } catch (err) {
            return res.status(400).json({ error: 'Could not delete the post.' });
        }
    } else {
        return res.status(400).json({error: 'Access denied. Sign in to delete posts!'})
    }
});

export default router;