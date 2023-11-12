import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { httpClient } from '../../api';
import { SignInForm } from '../../components/auth';
import { setToken } from '../../utils/cookies';
import { AuthResponse, InputValues } from '../../types/auth.types';

export default function SignIn() {
	const navigate = useNavigate();

	const handleSubmit = async (values: InputValues) => {
		const { password, email } = values;

		const { data } = await httpClient.post<AuthResponse>('/user/login', {
			password,
			email,
		});

		setToken(data.token);
	};

	const { mutate, isLoading } = useMutation({
		mutationFn: (values: InputValues) => handleSubmit(values),
		onSuccess: () => {
			navigate('/main');
		},
	});

	return (
		<div className='w-full md:w-1/2 flex items-center md:h-screen'>
			<div className='w-11/12 xl:w-7/12 mx-auto mt-5 md:mt-0'>
				<h4 className='text-2xl font-semibold'>Sign In</h4>
				<SignInForm mutate={mutate} isLoading={isLoading} />
				<div className='flex flex-col lg:flex-row'>
					<p className='mr-2'>You don't have an account?</p>
					<Link
						to='/auth/register'
						className='text-blue-700 font-medium mb-5 md:mb-0'
					>
						Create an account
					</Link>
				</div>
			</div>
		</div>
	);
}
