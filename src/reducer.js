import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'

import articleData from 'containers/Articles/reducer'
import page from 'pages/reducer'

export default location => combineReducers({
	location,
	form,
	articleData,
	page
})