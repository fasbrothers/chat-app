import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import { Form, Input } from 'antd';
import { ButtonPrimary } from '../shared/button';
import { AuthProps, InputValues } from '../../types/auth.types';

export const SignUpForm = ({ mutate, isLoading }: AuthProps) => {
	const [form] = Form.useForm();

	const handleSubmit = (values: InputValues) => {
		mutate(values);
	};

	return (
		<Form
			form={form}
			name='register'
			onFinish={handleSubmit}
			scrollToFirstError
		>
			<Form.Item
				name='name'
				label='Name'
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 24 }}
				rules={[
					{
						required: true,
						message: 'Please input your name!',
						whitespace: true,
					},
					{ min: 2, message: 'Name must be minimum 2 characters.' },
				]}
			>
				<Input
					name='name'
					className='input__style'
					suffix={<AccountCircleIcon className='text-gray-500' />}
				/>
			</Form.Item>
			<Form.Item
				name='email'
				label='Email'
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 24 }}
				rules={[
					{ required: true, message: 'Please input your email!' },
					{ type: 'email' },
				]}
			>
				<Input
					className='input__style'
					name='email'
					suffix={<EmailIcon className='text-gray-500' />}
				/>
			</Form.Item>
			<Form.Item
				name='password'
				label='Password'
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 24 }}
				rules={[
					{
						required: true,
						message: 'Please input your password!',
					},
					{ min: 7, message: 'Password must be minimum 6 characters.' },
				]}
				hasFeedback
			>
				<Input.Password className='input__style' name='password' />
			</Form.Item>
			<Form.Item
				name='confirm'
				label='Confirm Password'
				dependencies={['password']}
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 24 }}
				hasFeedback
				rules={[
					{
						required: true,
						message: 'Please confirm your password!',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve();
							}
							return Promise.reject(
								new Error('The new password that you entered do not match!')
							);
						},
					}),
				]}
			>
				<Input.Password className='input__style' />
			</Form.Item>

			<Form.Item>
				<ButtonPrimary isLoading={isLoading} title='Sign Up' />
			</Form.Item>
		</Form>
	);
};
