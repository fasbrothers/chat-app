import { ButtonPrimary } from '../../components/shared/button';
import { useDataFetching } from '../../hooks/useDataFetching';
import { PostResponse } from '../../types/post.types';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ModalPost } from '../../components/main';

function Main() {
	const { isLoading, data: posts } = useDataFetching<PostResponse[]>(
		'posts',
		'/user/getPosts'
	);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const showModal = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsModalOpen(true);
	};

	return (
		<div>
			<form onSubmit={e => showModal(e)}>
				<ButtonPrimary title='Create post' weight='100px' />
			</form>
			{isLoading
				? 'Loading'
				: posts?.map((post: PostResponse) => (
						<div
							key={post.id}
							className=' border border-gray-200 w-full p-4 rounded-xl hover:shadow-xl transition duration-300 my-4'
						>
							<div className='flex justify-between'>
								<h4>{post.title}</h4>
								<p>{dayjs(post.createdAt).format('DD.MM.YYYY')}</p>
							</div>
							<p>{post.content}</p>
						</div>
				))}

			<ModalPost
				title='Create post'
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
			/>
		</div>
	);
}

export default Main;
