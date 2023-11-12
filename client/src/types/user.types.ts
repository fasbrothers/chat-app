import { JwtPayload } from 'jwt-decode';

export interface UserResponse {
	id: string;
	email: string;
	name: string;
}

export interface HeaderProps {
	setShowNavbar: (showNavbar: boolean) => void;
	showNavbar: boolean;
}

export interface SidebarInMainProps {
	showNavbar: boolean;
	setShowNavbar: (showNavbar: boolean) => void;
	profile: UserResponse;
}
export interface FollowingsResponse {
	followingList: FollowingList[];
}

export interface FollowingList {
	id: string;
	name: string;
}

export interface DecodedToken extends JwtPayload {
	id: string;
}
