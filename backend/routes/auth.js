import User from '../models/User.js';
import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {

        const {username, password} = req.body;

        const userExists = await User.findOne({username});
        if (userExists) return res.status(409).json({error: 'User already exists.'});

        const salt = await bcrypt.genSalt(5);
        const hashed_password = await bcrypt.hash(password, salt);

        const newUser = new User({username, password: hashed_password});
        await newUser.save();

        req.session.user = { name: username, id: newUser._id };
        return res.status(200).json({
            id: newUser._id,
            username: username
        });
    } catch (err){
        return res.status(500).json({error: err.message});
    }
});

router.post('/login', async (req, res) => {
    try {

        const {username, password} = req.body;

        const user = await User.findOne({username});
        if (!user) return res.status(404).json({error: `The user ${username} does not exist. Please register your account.`});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({error: 'Invalid credentials.'});

        req.session.user = { name: username, id: user._id };
        return res.status(200).json({
            id: user._id, 
            name: username
        })

    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
});

router.get('/me', async (req, res) => {
    if (req.session.user){
        return res.status(200).json({ user: req.session.user });
    } else {
        return res.status(404).json({ error: 'User not found.' });
    }
});

export default router;