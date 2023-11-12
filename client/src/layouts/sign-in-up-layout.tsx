import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { SignSidebar } from '../components/auth';

export default function SignInUpLayout() {
	return (
		<div>
			<div className='flex flex-col-reverse min:h-screen md:flex-row mx-auto 2xl:w-5/6'>
				<Suspense fallback={<AuthContentLoader />}>
					<Outlet />
				</Suspense>
				<SignSidebar />
			</div>
		</div>
	);
}

function AuthContentLoader() {
	return (
		<div className='flex justify-center items-center w-4/6'>
			<Spin size='large' />
		</div>
	);
}
