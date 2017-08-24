import { redirect } from 'redux-first-router'

export default {
	onBeforeChange: (dispatch, getState, action) => {
		const { user, location: { routesMap } } = getState()
		const allowed = isAllowed(action.type, user, routesMap)

		if (!allowed) {
			const action = redirect({ type: 'LOGIN' })
			dispatch(action)
		}
	}
}

const isAllowed = (type, user, routesMap) => {
	const role = routesMap[type] && routesMap[type].role

	if (!role) return true
	if (!user) return false

	return user.roles.includes(role)
}