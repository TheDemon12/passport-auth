import passport from 'passport';
import { Request } from 'express';
import passportJwt from 'passport-jwt';
import { User, UserType } from '../models/User';
import { getJwtSecretKey } from '../utils/jwt';

const cookieExtractor = (
	req: Request<{}, {}, { cookies?: { jwt?: string } }>
) => {
	if (req && req.cookies) return req.cookies['jwt'].split(' ')[1];
	else return null;
};

var JwtOptions: passportJwt.StrategyOptions = {
	jwtFromRequest: cookieExtractor,
	secretOrKey: getJwtSecretKey(),
};

const verifyCallback = async (
	jwtPayload: { sub: string },
	done: (err: any, user?: UserType | false) => void
) => {
	try {
		const user: UserType = await User.findById(jwtPayload.sub);
		if (!user) return done(null, false);

		return done(null, user);
	} catch (err) {
		done(err);
	}
};

const strategy = new passportJwt.Strategy(JwtOptions, verifyCallback);
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
