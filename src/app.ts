import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';
// import { mongoSession } from './config/mongoConnect';
import routes from './routes';
import './config/passport';
import passport from 'passport';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('tiny'));

connectToDatabase();
// app.use(mongoSession);
app.use(passport.initialize());
// app.use(passport.session());
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
