import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import React from 'react';
import SignIn from '../pages/sign-in';
import SignUp from '../pages/sign-up';

const Main = React.lazy(() => import('../pages/main'));
const NotFound = React.lazy(() => import('../pages/not-found'));
const MainLayout = React.lazy(() => import('../layouts/main-layout'));
const RootLayout = React.lazy(() => import('../layouts/root-layout'));
const SignInUpLayout = React.lazy(() => import('../layouts/sign-in-up-layout'));
const Messages = React.lazy(() => import('../pages/messages'));

const routes: RouteObject[] = [
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <Navigate to='main' />,
			},
			{
				path: 'main',
				element: <MainLayout />,
				children: [
					{ path: '', element: <Main /> },
					{
						path: 'messages',
						element: <Messages />,
						children: [{ path: ':id', element: <Messages /> }],
					},
				],
			},
			{
				path: 'auth',
				element: <SignInUpLayout />,
				children: [
					{
						index: true,
						element: <Navigate to='login' />,
					},
					{
						children: [
							{ path: 'login', element: <SignIn /> },
							{ path: 'register', element: <SignUp /> },
							{ path: '*', element: <SignIn /> },
						],
					},
				],
			},
			{ path: '*', element: <NotFound /> },
		],
	},
];

export function Routes() {
	return useRoutes(routes);
}
