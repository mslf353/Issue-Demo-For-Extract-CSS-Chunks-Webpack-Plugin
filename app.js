const dotenv = require('dotenv')
const join = require('path').join

const NODE_ENV = (process.env.NODE_ENV || 'development')

dotenv.config({
	path: join('.', `${NODE_ENV}.env`),
	silent: true
})

dotenv.config()

const env = process.env

const http = require('http')
const express = require('express') 
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const bodyParser = require('body-parser')
const ms = require('ms')

const app = express()
const port = normalizePort(process.env.PORT || 3000)

app.set('port', port)
app.enable('trust proxy', 'loopback')

app.use(hpp())
app.use(require('compression')())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
	extended: false
}))

app.use(cookieParser(env.SESSION_SECRET, {
	maxAge: ms(env.USER_EXPIRE),
	secure: true
}))

app.use(session({
	store: new RedisStore({
		host: env.REDDIS_HOST,
		port: parseInt(env.REDDIS_PORT),
		db: parseInt(env.REDDIS_DB),
		ttl: ms(env.USER_EXPIRE) / 1000
	}),
	cookie: {
		maxAge: ms(env.USER_EXPIRE),
		secure: true
	},
	secret: env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
}))

const webpack = require('webpack')
const config = require(join(__dirname, '/config/webpack.config.js'))
const clientConfig = config.find(config => config.name === 'client')
const serverConfig = config.find(config => config.name === 'server')
const devServerConfig = clientConfig.devServer

if (NODE_ENV === 'production')
	app.use(clientConfig.output.publicPath, express.static(clientConfig.output.path))
else
	app.use(devServerConfig.publicPath, express.static(devServerConfig.contentBase))

app.use(serverConfig.output.publicPath, express.static(serverConfig.output.path))

if (NODE_ENV === 'development') {
	const compiler = webpack(config)

	const webpackDevMiddlewareInstance = require('webpack-dev-middleware')(compiler, devServerConfig)

	app.use(webpackDevMiddlewareInstance)

	if (devServerConfig.hot) {
		app.use(require('webpack-hot-middleware')(compiler.compilers.find(compiler => compiler.name === 'client'), {
			log: console.log,
			path: '/__webpack_hmr',
			heartbeat: 10000
		}))

		app.use(require('webpack-hot-server-middleware')(compiler))
	}

	webpackDevMiddlewareInstance.waitUntilValid(ready)
} else {
	webpack(config).run((err, stats) => {
		const clientStats = stats.toJson().children[0]
		const serverRender = require(join(serverConfig.output.path, serverConfig.output.filename)).default

		app.use(serverRender({ clientStats }))

		ready()
	})
}

function ready() {
	const server = http.createServer(app)
	server.on('error', onError)
	server.listen(port, () => console.log('Server started', server.address()))
}

function onError(error) {
	if (error.syscall !== 'listen')
		throw error

	const bind = typeof port === 'string' ?
		'Pipe ' + port :
		'Port ' + port

	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges')
			process.exit(1)
			break
		case 'EADDRINUSE':
			console.error(bind + ' is already in use')
			process.exit(1)
			break
		default:
			throw error
	}
}

function normalizePort(val) {
	const port = parseInt(val, 10)

	if (isNaN(port)) {
		// named pipe
		return val
	}

	if (port >= 0) {
		// port number
		return port
	}

	return false
}