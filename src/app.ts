import express, { Request, Response, Application, urlencoded } from 'express';
import session from 'express-session';
import mongoose, { MongooseOptions } from 'mongoose';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const dbUrl = 'mongodb://127.0.0.1:27017';
const dbOptions: MongooseOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

const connectDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL!, dbOptions);
		console.log('Successfully connected to MongoDB');
	} catch (ex) {
		throw new Error("Can't connect to MongoDB");
	}
};

connectDatabase();

declare module 'express-session' {
	interface SessionData {
		viewCount: number;
	}
}

const sessionStore = MongoStore.create({
	mongoUrl: process.env.MONGODB_URL,
	dbName: process.env.DB_NAME,
	collectionName: process.env.SESSIONS_COLLECTION,
});

app.use(
	session({
		secret: 'some secret',
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

app.get('/', (req: Request, res: Response): void => {
	if (!req.session.viewCount) req.session.viewCount = 1;
	else req.session.viewCount += 1;
	res.send(`Hello Typescript with Node.js!: ${req.session.viewCount}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
