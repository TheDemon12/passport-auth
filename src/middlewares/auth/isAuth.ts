import { Request, Response, NextFunction } from 'express';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	if (!req.isAuthenticated()) return res.status(401).send('Unauthorized');

	next();
};

export default isAuthenticated;
