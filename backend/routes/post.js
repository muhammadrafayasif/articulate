import Post from '../models/Post.js';
import express from 'express';

const router = express.Router();

router.get('/get', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return res.status(200).json(posts);
    } catch (err){
        return res.status(400).json({ error: 'Could not fetch posts.' });
    }
});

router.post('/new', async (req, res) => {
    if (req.session?.user?.id){
        try {
            const { title, content } = req.body;
            const newPost = new Post({ title, content, posted_by: req.session.user.id });
            await newPost.save();
            
            return res.status(200).json(newPost);
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    } else {
        return res.status(400).json({error: 'Access denied. Sign in to post!'})
    }
});

export default router;