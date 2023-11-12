import { Form, Input, Modal } from 'antd';
import { ButtonPrimary } from '../shared/button';
import { ModalPostProps } from '../../types/post.types';
import { httpClient } from '../../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toastSuccessMessage } from '../../utils/toast-message';

export const ModalPost = ({
	title,
	isModalOpen,
	setIsModalOpen,
}: ModalPostProps) => {
	const [form] = Form.useForm();
	const queryClient = useQueryClient();
	const { TextArea } = Input;

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const { mutate, isLoading } = useMutation({
		mutationFn: async (values: { title: string; content: string }) => {
			await httpClient.post('/user/createPost', values);

			form.resetFields();
		},
		onSuccess: () => {
			toastSuccessMessage('Post created successfully');
			queryClient.invalidateQueries(['posts']);
			setIsModalOpen(false);
		},
	});

	return (
		<Modal title={title} open={isModalOpen} onCancel={handleCancel}>
			<Form form={form} name='update' onFinish={mutate} scrollToFirstError>
				<Form.Item
					name='title'
					label='Title'
					labelCol={{ span: 24 }}
					wrapperCol={{ span: 24 }}
					rules={[
						{
							required: true,
							message: 'Please input your post title!',
							whitespace: true,
						},
						{
							min: 2,
							message: 'Title must be at least 2 characters long',
						},
					]}
				>
					<Input className='input__style' />
				</Form.Item>
				<Form.Item
					name='content'
					label='Content'
					labelCol={{ span: 24 }}
					wrapperCol={{ span: 24 }}
					rules={[
						{
							required: true,
							message: 'Please input your post content!',
							whitespace: true,
						},
						{
							min: 6,
							message: 'Content must be at least 6 characters long',
						},
					]}
				>
					<TextArea rows={4} className='input__style' />
				</Form.Item>
				<Form.Item>
					<ButtonPrimary isLoading={isLoading} title={title} />
				</Form.Item>
			</Form>
		</Modal>
	);
};
