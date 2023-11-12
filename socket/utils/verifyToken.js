import jwt from 'jsonwebtoken';

export default function verifyToken(token) {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return decoded.id;
	} catch (error) {
		return null;
	}
}
