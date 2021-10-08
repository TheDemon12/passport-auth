import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

import { connectToDatabase } from './config/database';
import routes from './routes';
import './config/passport';
import './config/passportGoogle';

dotenv.config();

const app = express();

app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000/', 'http://192.168.0.109:3000/'],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('tiny'));

connectToDatabase();
app.use(passport.initialize());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Server Running here 👉 https://localhost:${PORT});
});