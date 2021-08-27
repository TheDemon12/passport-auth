import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	hashedPassword: {
		type: String,
		required: true,
	},
	isAdmin: {
		type: Boolean,
		required: false,
	},
});

export const User = mongoose.model('User', userSchema);

export interface UserType {
	id: string;
	username: string;
	hashedPassword: string;
	isAdmin: boolean;
}
