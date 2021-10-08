import { Request, Response, Router } from 'express';
import { User, UserType } from './../models/User';
import { generatePassword, validatePassword } from '../utils/password';
import isAuth from '../middlewares/auth/isAuth';
import isAdmin from '../middlewares/auth/isAdmin';
import { generateJWT } from '../utils/jwt';
import passport from 'passport';

const router = Router();

router.get('/', (req, res) => res.send('Api home'));

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email, authType: 'local' });
	if (!user) return res.status(401).send('Invalid Email or Password!');

	const isValid = await validatePassword(password, user.hashedPassword!);
	if (!isValid) return res.status(401).send('Invalid Email or Password!');

	const tokenObject = generateJWT(user);

	return res
		.cookie('jwt', tokenObject.token, {
			httpOnly: true,
			maxAge: tokenObject.expires,
			secure: true,
		})
		.send('logged in!');
});

router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;

	const user = await User.findOne({ email, authType: 'local' });
	if (user) return res.status(400).send('User Already Registered!');

	const hashedPassword = await generatePassword(password);

	const newUser = new User({ name, email, authType: 'local', hashedPassword });
	await newUser.save();

	const tokenObject = generateJWT(newUser);

	return res
		.cookie('jwt', tokenObject.token, {
			httpOnly: true,
			maxAge: tokenObject.expires,
			secure: true,
		})
		.send('user registered!');
});

router.get(
	'/register/google',
	passport.authenticate('google', {
		session: false,
		scope: ['profile', 'email'],
	})
);
router.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		session: false,
		failureRedirect: 'http://localhost:5000/login',
	}),
	(req, res) => {
		const user = req.user;
		console.log(user);
		if (user) {
			//@ts-ignore
			const tokenObject = generateJWT(user);

			return res
				.cookie('jwt', tokenObject.token, {
					httpOnly: true,
					maxAge: tokenObject.expires,
					secure: true,
				})
				.redirect('http://localhost:3000/');
		}
	}
);

router.get('/logout', isAuth, (req, res) => {
	res.clearCookie('jwt').send('Logged out!');
});

router.get('/protected', isAuth, (req, res) => {
	console.log(req.isAuthenticated());
	return res.status(200).send('protected route!!');
});
router.get('/admin', [isAuth, isAdmin], (req: Request, res: Response) => {
	return res.status(200).send('admin route!!');
});

export default router;
