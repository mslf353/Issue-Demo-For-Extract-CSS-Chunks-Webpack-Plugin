import { createStore, applyMiddleware, compose } from 'redux'
import { connectRoutes } from 'redux-first-router'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'

import rootReducer from '../reducer'

import axios from 'axios'

import routesMap from '../routesMap'
import routerOptions from '../routerOptions'

export default function configureStore(history, initialState) {
	const router = connectRoutes(history, routesMap, routerOptions)
	const { thunk } = router

	const enhancer = compose(
		router.enhancer,
		applyMiddleware(router.middleware, promiseMiddleware, thunkMiddleware.withExtraArgument({ axios }))
	)(createStore)

	const store = enhancer(rootReducer(router.reducer), initialState)

	return { store, thunk }
}