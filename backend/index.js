import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import serverless from 'serverless-http';

import connectDatabase from './config/connectDB.js';
import usersRoute from './routes/auth.js';
import postsRoute from './routes/post.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}));

app.use(express.json());

try {
  await connectDatabase();
} catch (err) {
  console.error('MongoDB connection failed:', err);
}

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Welcome to the Articulate API!' });
});
app.use('/users', usersRoute);
app.use('/post', postsRoute);

export default serverless(app);