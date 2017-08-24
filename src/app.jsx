import 'react-hot-loader/patch'
import React from 'react'
import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import createServerHistory from 'history/createMemoryHistory'
import { AppContainer } from 'react-hot-loader'
import $ from 'jquery'

import Root from './Root'
import configureStore from './store'

const initialState = typeof window !== 'undefined' ? window.__REDUX_STATE__ : {}

let history

if (__IS_CLIENT__) {
	history = createHistory()
	$('#redux-state').remove();
} else
	history = createServerHistory()

export const { store } = configureStore(history, initialState)

if (__IS_CLIENT__) {
	const mountNode = document.querySelector('#app')

	render(
		<AppContainer>
			<Root store={store} history={history} />
		</AppContainer>, mountNode
	)

	if (module.hot)
		module.hot.accept('./Root', () => {
			const Root = require('./Root').default
			render(
				<AppContainer>
					<Root store={store} history={history} />
				</AppContainer>, mountNode
			)
		})
}