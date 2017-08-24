import { createStore, applyMiddleware, compose } from 'redux'
import { connectRoutes } from 'redux-first-router'
import { persistState } from 'redux-devtools'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'

import rootReducer from '../reducer'
import DevTools from '../DevTools'

import axios from 'axios'

import routesMap from '../routesMap'
import routerOptions from '../routerOptions'

const logger = createLogger()

export default function configureStore(history, initialState) {
	const router = connectRoutes(history, routesMap, routerOptions)
	const { thunk } = router

	var enhancer

	if (__IS_CLIENT__) {
		enhancer = compose(
			router.enhancer,
			applyMiddleware(router.middleware, promiseMiddleware, thunkMiddleware.withExtraArgument({ axios }), logger, reduxImmutableStateInvariant()),
			(window.devToolsExtension) ? window.devToolsExtension() : DevTools.instrument(),
			// Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
			persistState(getDebugSessionKey())
		)
	} else {
		enhancer = compose(
			router.enhancer,
			applyMiddleware(router.middleware, promiseMiddleware, thunkMiddleware.withExtraArgument({ axios }))
		)
	}

	const store = createStore(rootReducer(router.reducer), initialState, enhancer)

	if (module.hot) {
		module.hot.accept('../reducer', () => {
			const nextReducer = require('../reducer').default
			store.replaceReducer(nextReducer)
		})
	}

	return { store, thunk }
}

// By default we try to read the key from ?debug_session=<key> in the address bar
function getDebugSessionKey() {
	const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/)
	return (matches && matches.length) ? matches[1] : null
}