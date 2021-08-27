import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

dotenv.config();

const sessionStore = MongoStore.create({
	mongoUrl: process.env.MONGODB_URL,
	dbName: process.env.DB_NAME,
	collectionName: process.env.SESSIONS_COLLECTION,
});

export const mongoSession = session({
	secret: process.env.SECRET!,
	resave: false,
	saveUninitialized: true,
	store: sessionStore,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24,
	},
});
