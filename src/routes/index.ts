import { Request, Response, Router } from 'express';
import passport from 'passport';
import { User } from './../models/User';
import { generatePassword } from '../utils/password';
import isAuth from '../middlewares/auth/isAuth';
import isAdmin from '../middlewares/auth/isAdmin';

const router = Router();

declare module 'express-session' {
	interface SessionData {
		viewCount: number;
	}
}

router.get('/', (req: Request, res: Response): void => {
	if (!req.session.viewCount) req.session.viewCount = 1;
	else req.session.viewCount += 1;
	res.send(`Hello Typescript with Node.js!: ${req.session.viewCount}`);
});

router.post('/login', passport.authenticate('local'), (req, res) => {
	res.send('login');
});

router.post('/register', async (req, res) => {
	const { username, password } = req.body;

	const hashedPassword = generatePassword(password);

	const user = new User({ username, hashedPassword });

	const savedUser = await user.save();
	console.log(savedUser);

	res.send('register done');
});

router.get('/logout', (req, res) => {
	if (!req.isAuthenticated()) return res.status(400).send('Not logged in!');

	req.logout();
	return res.status(200).send('Successfully logged out!');
});

router.get('/protected', isAuth, (req, res) => {
	res.status(200).send('protected route!!');
});
router.get('/admin', isAdmin, (req, res) => {
	res.status(200).send('admin route!!');
});

export default router;
