import socialVector from '../../assets/social-vector.jpg';

export const SignSidebar = () => {
	return (
		<div className={`w-full md:w-1/2 h-10 md:h-screen`}>
			<div className='flex-col items-center justify-center h-full flex'>
				<div className='w-full hidden md:flex lg:justify-center xl:justify-start'>
					<img
						src={socialVector}
						alt='hero'
						className='w-full lg:w-4/6 h-full object-contain'
					/>
				</div>
			</div>
		</div>
	);
};
