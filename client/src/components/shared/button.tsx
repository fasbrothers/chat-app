import { Button } from 'antd';

interface ButtonPrimaryProps {
	title: string;
	weight?: string;
	isLoading?: boolean;
	disabled?: boolean;
	bgColor?: string;
}

export const ButtonPrimary = ({
	title,
	weight,
	isLoading,
	disabled,
	bgColor,
}: ButtonPrimaryProps) => {
	return (
		<Button
			disabled={disabled}
			className={`${
				bgColor ? bgColor : 'bg-blue-700'
			} text-white h-full md:text-lg py-3 mx-auto text-center rounded-md hover:bg-white ${
				weight ? weight : 'w-full'
			} `}
			htmlType='submit'
			name='submit'
			loading={isLoading}
			style={{ fontFamily: 'Inter, sans-serif' }}
		>
			{title}
		</Button>
	);
};
