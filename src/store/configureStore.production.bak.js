import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'

import rootReducer from '../reducer'

import axios from 'axios'

export default function configureStore(history, initialState) {
	const enhancer = compose(
		applyMiddleware(routerMiddleware(history), promiseMiddleware, thunkMiddleware.withExtraArgument({ axios }))
	)(createStore)

  return enhancer(rootReducer, initialState)
}