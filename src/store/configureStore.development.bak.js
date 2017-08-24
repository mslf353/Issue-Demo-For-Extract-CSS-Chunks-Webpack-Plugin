import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { persistState } from 'redux-devtools'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'

import rootReducer from '../reducer'
import DevTools from '../DevTools'

import axios from 'axios'

const logger = createLogger()

var enhancer

export default function configureStore(history, initialState) {
	if (__IS_CLIENT__) {
		// By default we try to read the key from ?debug_session=<key> in the address bar
		const getDebugSessionKey = function () {
			const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/)
			return (matches && matches.length) ? matches[1] : null
		}

		enhancer = compose(
			applyMiddleware(routerMiddleware(history), promiseMiddleware, thunkMiddleware.withExtraArgument({ axios }), logger, reduxImmutableStateInvariant()),
			(window.devToolsExtension) ? window.devToolsExtension() : DevTools.instrument(),
			// Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
			persistState(getDebugSessionKey())
		)
	} else {
		enhancer = compose(
			applyMiddleware(routerMiddleware(history), promiseMiddleware, thunkMiddleware.withExtraArgument({ axios }))
		)
	}

	const store = createStore(rootReducer, initialState, enhancer)

	if (module.hot) {
		module.hot.accept('../reducer', () => {
			const nextReducer = require('../reducer').default
			store.replaceReducer(nextReducer)
		})
	}

	return store
}