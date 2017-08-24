if (__NODE_ENV__ === 'production' || __IS_SERVER__)
	module.exports = require('./configureStore.production').default;
else
	module.exports = require('./configureStore.development').default;