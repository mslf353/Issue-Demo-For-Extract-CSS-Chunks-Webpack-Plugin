import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { flushChunkNames } from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'
import configureStore from 'store'
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import createHistory from 'history/createMemoryHistory'
import { NOT_FOUND } from 'redux-first-router'
import Helmet from 'react-helmet'

var ServerRoot = require('./Root').ServerRoot

const serverRenderer = webpackstats => (req, res) => {
	const history = createHistory()
	const { store, thunk } = configureStore(history)
	
	let location = store.getState().location

	if (doesRedirect(location, res))
		return

	thunk(store).then(() => {
		location = store.getState().location

		if (doesRedirect(location, res))
			return

		const status = location.type === NOT_FOUND ? 404 : 200;

		res.status(status)

		let indexHTML = fs.readFileSync('.' + webpackstats.clientStats.publicPath + 'index.html')

		const body = ReactDOMServer.renderToString(
			<ServerRoot
				store={store}
				userAgent={req.headers['user-agent'] || 'all'}
			/>
		)

		const { js, styles, cssHash } = flushChunks(webpackstats.clientStats, {
			chunkNames: flushChunkNames(),
			before: ['manifest', 'vendor'],
			after: ['app'],
			outputPath: path.resolve('.' + webpackstats.clientStats.publicPath)
		});

		const helmet = Helmet.renderStatic()

		const state = store.getState()

		const $ = cheerio.load(indexHTML)

		$('#helmet')
			.after(helmet.title.toString() + helmet.meta.toString() + helmet.link.toString())
			.after(styles.toString())

		$('#helmet').remove()

		$('#redux-state').html('window.__REDUX_STATE__ = ' + JSON.stringify(state))
		$('#app').html('<div>' + body + '</div>').after(cssHash + js)

		res.set('content-type', 'text/html')
		res.send($.html())
		res.end()
	}).catch(err => {
		console.log(err)
		res.end(err)
	});
}

function doesRedirect({ kind, pathname }, res) {
	if (kind === 'redirect') {
		res.redirect(302, pathname)
		return true
	}
}

export default serverRenderer

if (module.hot)
	module.hot.accept('./Root', () => {
		ServerRoot = require('./Root').ServerRoot
	})