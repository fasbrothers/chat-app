import { Button } from 'antd';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { HeaderProps } from '../../types/user.types';

export const HeaderMain = ({ setShowNavbar, showNavbar }: HeaderProps) => {
	return (
		<div className='h-[8vh] flex justify-between items-center'>
			<Link to='/' className='text-xl font-bold italic text-blue-600'>
				Socialize
			</Link>
			<div className='flex items-center'>
				<Button
					className='md:hidden h-auto'
					onClick={() => setShowNavbar(!showNavbar)}
				>
					<MenuIcon />
				</Button>
			</div>
		</div>
	);
};
