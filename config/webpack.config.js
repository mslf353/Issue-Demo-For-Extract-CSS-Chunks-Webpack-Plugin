const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')
const fs = require('fs')
//const nodeExternals = require('webpack-node-externals')
const progressBar = require('progress')
const path = require('path')
const join = path.join

const root = join(__dirname, '..')
const src = join(root, 'src')
const modules = join(root, 'node_modules')
const clientDest = join(root, 'build-client')
const clientPublicPath = '/build-client/'
const serverDest = join(root, 'build-server')
const serverPublicPath = '/build-server/'

const NODE_ENV = (process.env.NODE_ENV || 'development')
const isProduction = NODE_ENV === 'production'
const isDev = NODE_ENV === 'development'
const isTest = NODE_ENV === 'test'

const minFileSize = 10000

const dotenv = require('dotenv')
dotenv.config({path: join(root, '.env')})

dotenv.config({
	path: join(root, 'config', `${NODE_ENV}.env`),
	silent: true
})

const envVariables = process.env

const defines = 
	Object.keys(envVariables)
	.reduce((memo, key) => {
		const val = JSON.stringify(envVariables[key])
		memo[`__${key.toUpperCase()}__`] = val
		return memo
	}, {
		__NODE_ENV__: JSON.stringify(NODE_ENV),
		__IS_PROD__: JSON.stringify(isProduction),
		__IS_DEV__: JSON.stringify(isDev),
		'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
	})

const clientDefines = Object.assign({}, defines, {
	__IS_CLIENT__: true,
	__IS_SERVER__: false
})

const serverDefines = Object.assign({}, defines, {
		__IS_CLIENT__: false,
	__IS_SERVER__: true
})

const cssLoader = {
	loader: 'css-loader',
	query: { sourceMap: isDev }
}

const clientCssModuleLoader = {
	loader: 'css-loader',
	query: {
		modules: true,
		sourceMap: true,
		localIdentName: '[name]__[local]___[hash:base64:5]'
	}
}

const serverCssModuleLoader = {
	loader: 'css-loader/locals',
	query: {
		modules: true,
		localIdentName: '[name]__[local]___[hash:base64:5]'
	}
}

const lessLoader = {
	loader: 'less-loader',
	query: { sourceMap: isDev }
}

const postCssLoader = {
	loader: 'postcss-loader',
	query: {
		sourceMap: isDev,
		plugins: [ require('autoprefixer') ]
	}
}

const common = {
	resolve: {
		modules: [src, modules],
		alias: {
			'constants$': join(src, 'constants.js'), 
			'components': join(src, 'components'),
			'containers': join(src, 'containers'),
			'pages': join(src, 'pages'),
			'helpers': join(src, 'helpers'),
			'global-styles': join(src, 'global-styles')
		},
		extensions: ['.js', '.min.js', '.jsx', '.json']
	}
}

let clientConfig = Object.assign({}, common, {
	name: 'client',
	target: 'web',
	context: src,
	entry: {
		app: [join(src, 'app.jsx')],
		vendor: [
			'axios',
			'classnames',
			'gsap',
			'history',
			'jquery',
			'lodash',
			'material-ui',
			'moment',
			'ms',
			'react',
			'react-dom',
			'react-helmet',
			'react-hot-loader',
			'react-motion',
			'react-redux',
			'react-transition-group',
			'react-truncate',
			'redux',
			'redux-actions',
			'redux-form',
			'redux-form-material-ui',
			'redux-promise',
			'redux-thunk',
			'validator'
		]
	},
	output: {
		path: clientDest,
		filename: isDev ? '[name].bundle.js' : '[name]-[hash].bundle.js',
		chunkFilename: '[name]-[chunkhash].bundle.js',
		publicPath: clientPublicPath,
	},
	plugins: [
		new CleanPlugin(clientDest, { root: root, verbose: false }),
		new webpack.DefinePlugin(clientDefines),
		new webpack.LoaderOptionsPlugin({
			debug: isDev,
			minimize: isProduction
		}),
		new ExtractCssChunksPlugin(),
		/*new webpack.optimize.MinChunkSizePlugin({
			minChunkSize: minFileSize
		}),*/
		new webpack.NoEmitOnErrorsPlugin(),
		new HtmlWebpackPlugin({
			cache: false,
			template: join(src, 'index.pug'),
			inject: false,
			minify: isDev ? false : {
				removeComments: isProduction,
				collapseWhitespace: isProduction
			}
		})
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx|babel)$/,
				enforce: 'pre',
				use: 'eslint-loader'
			},
			{
				test: /\.(js|jsx|babel)$/,
				exclude: [modules],
				use: 'babel-loader'
			},
			{
				test: /\.(otf|eot|svg|ttf|woff2?)(\?\S*)?$/,
				loader: 'url-loader',
				query: { limit: minFileSize }
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				loader: 'url-loader',
				query: { limit: minFileSize }
			},
			{
				test: /\.module\.css$/,
				use: ExtractCssChunksPlugin.extract({
					use: [
						clientCssModuleLoader,
						postCssLoader
					]
				})
			},
			{
				test: /^((?!module).)*\.less$/,
				use: ExtractCssChunksPlugin.extract({
					use: [
						cssLoader,
						postCssLoader,
						lessLoader
					]
				})
			},
			{
				test: /\.module\.less$/,
				use: ExtractCssChunksPlugin.extract({
					use: [
						clientCssModuleLoader,
						postCssLoader,
						lessLoader
					]
				})
			},
			{
				test: /\.css$/,
				use: ExtractCssChunksPlugin.extract({
					use: [
						cssLoader,
						postCssLoader
					]
				})
			},
			{
				test: /\.pug/,
				use: 'pug-loader'
			},
			{
				test: /\.html/,
				use: 'html-loader'
			}
		]
	},
	devtool: isDev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
	devServer: {
		publicPath: clientPublicPath,
		contentBase: clientDest,
		noInfo: false,
		hot: true,
		stats: {
			colors: false,
			chunks: 'normal'
		},
		historyApiFallback: true,
		proxy: {
			'*': 'http://localhost:3000'
		}
	}
})

let serverConfig = Object.assign({}, common, {
	name: 'server',
	context: src,
	target: 'node',
	node: { __dirname: true },
	entry: join(src, 'server.jsx'),
	output: {
		libraryTarget: 'commonjs2',
		path: serverDest,
		filename: 'server.js',
		publicPath: serverPublicPath
	},
	plugins: [
		new CleanPlugin(serverDest, { root: root, verbose: false }),
		new webpack.DefinePlugin(serverDefines),
		new webpack.LoaderOptionsPlugin({
			debug: isDev,
			minimize: isProduction
		}),
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		}),
		new webpack.NoEmitOnErrorsPlugin()
	],
	/*externals: [nodeExternals({ whitelist: [
		'react-universal-component',
		'webpack-flush-chunks',
		'gsap/src/minified/TweenLite',
		'webpack/hot/poll',
		/\.(?!(?:jsx?|json)$).{1,5}$/i]
	})],*/
	externals: fs
	.readdirSync(modules)
	.filter(x => !/\.bin|react-universal-component|webpack-flush-chunks|gsap\/src\/minified\/TweenLite|webpack\/hot\/poll/.test(x))
	.reduce((externals, mod) => {
		externals[mod] = `commonjs ${mod}`
	return externals
	}, {}),
	module: {
		rules: [
			{
				test: /\.(js|jsx|babel)$/,
				enforce: 'pre',
				use: 'eslint-loader'
			},
			{
				test: /\.(js|jsx|babel)$/,
				exclude: [modules],
				use: 'babel-loader'
			},
			{
				test: /\.(otf|eot|svg|ttf|woff2?)(\?\S*)?$/,
				loader: 'url-loader',
				query: { limit: minFileSize }
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				loader: 'url-loader',
				query: { limit: minFileSize }
			},
			{
				test: /\.module\.css$/,
				use: [
					serverCssModuleLoader,
					postCssLoader
				]
			},
			{
				test: /^((?!module).)*\.less$/,
				use: [
					'css-loader/locals',
					postCssLoader,
					'less-loader'
				]
			},
			{
				test: /\.module\.less$/,
				use: [
					serverCssModuleLoader,
					postCssLoader,
					'less-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					'css-loader/locals',
					postCssLoader
				]
			},
			{
				test: /\.html/,
				loader: 'html'
			}
		]
	}
})

if (!isTest) {
	clientConfig.plugins.splice(1, 0, new webpack.optimize.UglifyJsPlugin({
		mangle: isProduction,
		compress: isDev ? false : { warnings: false },
		output: {
			comments: isDev
		},
		sourceMap: isDev
	}))

	clientConfig.plugins.splice(2, 0, new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		filename: 'vendor.bundle.js',
		minChunks: Infinity
	}))
	
	clientConfig.plugins.splice(3, 0, new webpack.optimize.CommonsChunkPlugin({
		name: 'manifest'
	}))

	clientConfig.plugins.push(new ProgressBarPlugin(percentage => progressBar.update(percentage)))
	serverConfig.plugins.push(new ProgressBarPlugin(percentage => progressBar.update(percentage)))
	
	clientConfig.plugins.push(new Visualizer())
	serverConfig.plugins.push(new Visualizer())
}

if (isDev) {
	clientConfig.entry.app.unshift(
		'webpack/hot/dev-server',
		'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false'
	)

	clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
	clientConfig.plugins.push(new WriteFilePlugin({ log: false }))
	serverConfig.plugins.push(new WriteFilePlugin({ log: false }))

	clientConfig.devServer.stats.chunks = false
}

module.exports = [clientConfig, serverConfig]
