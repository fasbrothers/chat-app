export interface PostResponse {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	authorId: string;
}

export interface ModalPostProps {
	setIsModalOpen: (isModalOpen: boolean) => void;
	isModalOpen: boolean;
	title: string;
}
