import mongoose, { MongooseOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbOptions: MongooseOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

export const connectToDatabase = async () => {
	try {
		await mongoose.connect(
			`${process.env.MONGODB_URL}/${process.env.DB_NAME}`,
			dbOptions
		);
		console.log('Successfully connected to MongoDB');
	} catch (ex) {
		throw new Error("Can't connect to MongoDB");
	}
};
