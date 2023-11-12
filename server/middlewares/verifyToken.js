import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
	try {
		const token = req.headers.authorization;
		if (!token) return res.status(401).json({ error: 'Unauthorized' });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
}
