import Cookies from 'js-cookie';

export function getFromCookie(item: string) {
	return Cookies.get(item);
}

export function removeFromCookie(item: string) {
	return Cookies.remove(item);
}

export function setToken(token: string) {
	Cookies.set('token', token);
}

export function setReceiverId(receiverId: string) {
	Cookies.set('receiverId', receiverId);
}
