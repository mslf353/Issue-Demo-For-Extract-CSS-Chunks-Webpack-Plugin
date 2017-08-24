import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Layout from 'containers/Layout'

export default class Root extends Component {
	static propTypes = {
		name: PropTypes.string,
		store: PropTypes.object.isRequired
	}
	
	render() {
		const { store } = this.props

		return (
			<Provider store={store}>
				<MuiThemeProvider>
					<Layout />
				</MuiThemeProvider>
			</Provider>
		)
	}
}

export class ServerRoot extends Component {
	static propTypes = {
		name: PropTypes.string,
		store: PropTypes.object.isRequired,
		userAgent: PropTypes.string.isRequired
	}

	render() {
		const { store, userAgent } = this.props

		const muiTheme = getMuiTheme({
			userAgent: userAgent,
		});

		return (
			<Provider store={store}>
				<MuiThemeProvider muiTheme={muiTheme}>
					<Layout />
				</MuiThemeProvider>
			</Provider>
		)
	}
}