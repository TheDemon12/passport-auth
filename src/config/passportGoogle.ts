import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import { User, UserType } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: '/auth/google/callback',
		},
		async function (accessToken, refreshToken, profile, done) {
			try {
				let user = await User.findOne({ googleId: profile.id });
				if (user) done(null, user);
				else {
					const newUser = new User({
						authType: 'google',
						googleId: profile.id,
						email: profile.emails![0].value,
						name: profile.displayName,
						displayPicture: profile.photos![0].value,
					});

					await newUser.save();

					done(null, newUser);
				}
			} catch (ex: any) {
				done(ex);
			}
		}
	)
);

//@ts-ignore
passport.serializeUser(function (user: UserType, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err: any, user: UserType) {
		done(err, user);
	});
});
