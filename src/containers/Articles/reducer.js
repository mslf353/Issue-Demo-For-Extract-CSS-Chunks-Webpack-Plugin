import { handleActions } from 'redux-actions';
import * as actions from './actions';
import { REQUESTING, RECEIVED, SENDING, SENT, ERROR } from 'constants';

export default handleActions({
		[actions.invalidateArticles]: state => Object.assign({}, state, {
			isValid: false
		}),

		[actions.request]: (state, action) => Object.assign({}, state, {
			fetchStatus: REQUESTING,
			fetchUrl: action.payload
		}),

		[actions.receive]: state => Object.assign({}, state, {
			fetchStatus: RECEIVED,
			isValid: true,
			lastUpdated: Date.now()
		}),

		[actions.errorReceiving]: state => Object.assign({}, state, {
			fetchStatus: ERROR,
			isValid: false
		}),

		[actions.send]: (state, action) => Object.assign({}, state, {
			sendStatus: SENDING,
			fetchUrl: action.payload
		}),

		[actions.sent]: state => Object.assign({}, state, {
			sendStatus: SENT
		}),

		[actions.errorSending]: state => Object.assign({}, state, {
			sendStatus: ERROR
		}),

		[actions.createArticle]: state => Object.assign({}, state, {
			creating: true
		}),

		[actions.finishCreatingArticle]: state => Object.assign({}, state, {
			creating: false
		}),

		[actions.editArticle]: (state, action) => Object.assign({}, state, {
			editingId: action.payload
		}),

		[actions.finishUpdatingArticle]: state => Object.assign({}, state, {
			editingId: null
		}),

		[actions.updateArticles]: (state, action) => Object.assign({}, state, {
			articles: action.payload
		}),

		[actions.commitArticle]: (state, action) => {
			let articles = [...state.articles];

			let index = articles.indexOf(articles.find(article => article._id === action.payload._id));

			if (index >= 0)
				articles[index] = action.payload;
			else
				articles.unshift(action.payload);

			return Object.assign({}, state, {
				articles: articles
			})
		},

		[actions.commitArticleDeletion]: (state, action) => {
			let articles = [...state.articles];

			delete articles.splice(articles.indexOf(articles.find(article => article._id === action.payload)), 1);

			return Object.assign({}, state, {
				articles: articles
			})
		}
	}, {
		articles: [],
		fetchStatus: null,
		lastUpdated: null,
		fetchUrl: '',
		sendStatus: null,
		sendUrl: '',
		isValid: false,
		creating: false,
		currentId: null,
		editingId: null,
	});