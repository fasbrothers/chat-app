import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getFromCookie } from '../utils/cookies';

export default function RootLayout() {
	const tokenNum = getFromCookie('token');
	const { pathname } = useLocation();

	if (tokenNum && pathname.includes('auth')) {
		return <Navigate to='/main' />;
	}
	if (!tokenNum && !pathname.includes('auth')) {
		return <Navigate to='/auth/login' />;
	}

	return <Outlet />;
}
