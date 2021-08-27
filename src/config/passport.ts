import passport from 'passport';
import passportLocal from 'passport-local';
import { User } from '../models/User';
import { validatePassword } from './../utils/password';

interface UserType {
	id: string;
	username: string;
	hashedPassword: string;
	isAdmin: boolean;
}

const verifyCallback = async (
	username: string,
	password: string,
	done: (err: any, user?: UserType | false) => void
) => {
	try {
		const user: UserType = await User.findOne({
			username,
		});

		if (!user) return done(null, false);

		const isValid = await validatePassword(password, user.hashedPassword);
		if (!isValid) return done(null, false);

		return done(null, user);
	} catch (err) {
		done(err);
	}
};

const strategy = new passportLocal.Strategy(verifyCallback);

passport.use(strategy);

//@ts-ignore
passport.serializeUser(function (user: UserType, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err: any, user: UserType) {
		done(err, user);
	});
});
