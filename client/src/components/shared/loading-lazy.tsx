import { Spin } from 'antd';

export const LoadingLazy = () => {
	return (
		<div className='w-full h-[600px] flex justify-center items-center text-center'>
			<Spin size='large' />
		</div>
	);
};
