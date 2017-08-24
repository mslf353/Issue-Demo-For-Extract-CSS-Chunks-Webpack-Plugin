import { createAction } from 'redux-actions';

export const invalidateArticles = createAction('INVALIDATE_ARTICLES');
export const request = createAction('REQUEST_ARTICLE');
export const receive = createAction('RECEIVE_ARTICLE');
export const errorReceiving = createAction('ERROR_RECEIVING_ARTICLE');

export const updateArticles = createAction('UPDATE_ARTICLES');

export const send = createAction('SEND_ARTICLE');
export const sent = createAction('SENT_ARTICLE');
export const errorSending = createAction('ERROR_SENDING_ARTICLE');

export const createArticle = createAction('CREATE_ARTICLE');
export const finishCreatingArticle = createAction('FINISH_CREATING_ARTICLE');

export const editArticle = createAction('EDIT_ARTICLE');
export const finishUpdatingArticle = createAction('FINISH_UPDATING_ARTICLE');

export const confirmDelete = createAction('CONFIRM_DELETE_ARTICLE');

export const commitArticle = createAction('COMMIT_ARTICLE');
export const commitArticleDeletion = createAction('COMMIT_ARTICLE_DELETION');

export function fetchArticle() {
	return () => {

	}
}

export function fetchArticles() {
	return () => {
	}
}

export function addArticle() {
	return () => {

	}
}

export function updateArticle() {
	return () => {

	}
}

export function deleteArticle() {
	return () => {

	}
}

export function saveArticle(article) {
	return (dispatch, getState) => {
		let { creating } = getState().articleData;

		if (creating)
			dispatch(addArticle(article));
		else
			dispatch(updateArticle(article));
	}
}
