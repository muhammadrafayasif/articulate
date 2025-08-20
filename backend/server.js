import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';

import connectDatabase from './config/connectDB.js';
import usersRoute from './routes/auth.js';
import postsRoute from './routes/post.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false 
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase();

app.use('/api/users', usersRoute);
app.use('/api/post', postsRoute);

app.listen(process.env.PORT, () => console.log(`Started listening on PORT: ${process.env.PORT}`));