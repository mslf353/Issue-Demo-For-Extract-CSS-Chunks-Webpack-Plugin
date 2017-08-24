import { NOT_FOUND } from 'redux-first-router'

export default (state = 'HOME', action = {}) =>
	components[action.type] || state

const components = {
	ABOUT: 'About',
	ACCOUNT: 'Account',
	CONTACT: 'Contact',
	HOME: 'Home',
	REGISTER: 'Register',
	[NOT_FOUND]: 'NotFound'
}