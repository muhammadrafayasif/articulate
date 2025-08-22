import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import connectDatabase from './config/connectDB.js';
import usersRoute from './routes/auth.js';
import postsRoute from './routes/post.js';

dotenv.config();

const app = express();
connectDatabase();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(express.json());

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Welcome to the Articulate API!' });
});
app.use('/api/users', usersRoute);
app.use('/api/post', postsRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

export default app;