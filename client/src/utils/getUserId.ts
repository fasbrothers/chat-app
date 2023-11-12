import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types/user.types';
import { getFromCookie } from './cookies';

export function getUserId() {
	const token = getFromCookie('token');
	const decodedToken = jwtDecode(token || '') as DecodedToken;
	return decodedToken.id;
}
