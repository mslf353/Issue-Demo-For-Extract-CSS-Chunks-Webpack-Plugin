import Layout from 'containers/Layout';
import index from 'pages/Index/routes';
import about from 'pages/About/routes';
import register from 'pages/Register/routes';
import contact from 'pages/Contact/routes';
import notFound from 'pages/NotFound/routes';

/* Would be cool but order matters and the not found (404) page can take precedence if it's before others since its path is '*'
function requireAll(r) {
	let requires = [];
	r.keys().forEach(function(item) { requires.push(r(item).default) });
	return requires;
}

requireAll(require.context('./pages/', true, /routes\.jsx?$/))
*/

export default {
	component: Layout,
	childRoutes: [
		index,
		about,
		register,
		contact,
		notFound
	]
}