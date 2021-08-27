import { Request, Response, Router } from 'express';
import { User } from './../models/User';
import { generatePassword, validatePassword } from '../utils/password';
import isAuth from '../middlewares/auth/isAuth';
import isAdmin from '../middlewares/auth/isAdmin';
import { generateJWT } from '../utils/jwt';

const router = Router();

router.post('/login', async (req, res) => {
	const user = await User.findOne({ username: req.body.username });

	if (!user) return res.status(401).send('Invalid Username Or Password');

	const isValid = await validatePassword(
		req.body.password,
		user.hashedPassword
	);
	if (!isValid) return res.status(401).send('Invalid Username Or Password');

	const tokenObject = generateJWT(user);

	return res
		.cookie('jwt', tokenObject.token, {
			httpOnly: true,
			maxAge: tokenObject.expires,
		})
		.send('logged in!');
});

router.post('/register', async (req, res) => {
	const { username, password } = req.body;

	const hashedPassword = generatePassword(password);

	const user = new User({ username, hashedPassword });
	await user.save();

	return res.send('register done');
});

router.get('/logout', (req, res) => {
	if (!req.isAuthenticated()) return res.status(400).send('Not logged in!');

	req.logout();
	return res.status(200).send('Successfully logged out!');
});

router.get('/protected', isAuth, (req, res) => {
	console.log(req.isAuthenticated());
	return res.status(200).send('protected route!!');
});
router.get('/admin', [isAuth, isAdmin], (req: Request, res: Response) => {
	return res.status(200).send('admin route!!');
});

export default router;
