import { Request, Response, NextFunction } from 'express';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	//@ts-ignore
	if (req.isAuthenticated() && req.user.isAdmin) return next();

	return res.status(401).send('Unauthorized');
};

export default isAdmin;
