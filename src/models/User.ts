import mongoose from 'mongoose';

export interface UserType {
    id: string;
    email: string;
    name: string;
    authType: 'google' | 'local';
    hashedPassword?: string;
    googleId?: string;
    displayPicture?: string;
    isAdmin?: boolean;
}

const userSchema = new mongoose.Schema<UserType>({
    email: {
        type: String,
        required: true,
    },
    authType: {
        type: String,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: function (): Boolean {
            //@ts-ignore
            return this.authType === 'local';
        },
    },
    googleId: {
        type: String,
        required: function (): Boolean {
            //@ts-ignore
            return this.authType === 'google';
        },
    },
    name: {
        type: String,
        required: true,
    },
    displayPicture: {
        type: String,
        required: function (): Boolean {
            //@ts-ignore
            return this.authType === 'google';
        },
    },
    isAdmin: {
        type: Boolean,
        required: false,
    },
});

export const User = mongoose.model<UserType>('User', userSchema);