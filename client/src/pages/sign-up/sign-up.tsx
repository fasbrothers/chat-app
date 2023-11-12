import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { httpClient } from '../../api';
import { SignUpForm } from '../../components/auth';
import { setToken } from '../../utils/cookies';
import { AuthResponse, InputValues } from '../../types/auth.types';

export default function SignUp() {
	const navigate = useNavigate();

	const handleSubmit = async (values: InputValues) => {
		const { name, email, password } = values;
		const { data } = await httpClient.post<AuthResponse>('/user/register', {
			name,
			email,
			password,
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
		<div className='w-full md:w-1/2 flex items-center'>
			<div className='w-11/12 xl:w-7/12 mx-auto'>
				<h4 className='text-2xl font-semibold'>Sign Up</h4>
				<SignUpForm mutate={mutate} isLoading={isLoading} />
				<div className='flex'>
					<p className='mr-2'>Already registered?</p>
					<Link
						to='/auth/login'
						className='text-blue-700 font-medium mb-5 md:mb-0'
					>
						Sign In
					</Link>
				</div>
			</div>
		</div>
	);
}
