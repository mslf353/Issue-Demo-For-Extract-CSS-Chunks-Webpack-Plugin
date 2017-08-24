import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Truncate from 'react-truncate';
import moment from 'moment';

import { editArticle } from 'containers/Articles/actions';
import { DATE_FORMAT } from './constants';

import styles from './article.module.less';

export const defaults = () => {
	return {
		created: new Date(),
		updated: new Date(),
		published: true
	};
}

class Article extends Component {
	static propTypes = {
		article: PropTypes.object.isRequired,
		teaser: PropTypes.bool,
		stripe: PropTypes.string,
		dispatch: PropTypes.func.isRequired
	}

	edit() {
		let { article, dispatch } = this.props;
		dispatch(editArticle(article._id));
	}

	delete() {
	}

	links = (
		<div className={styles['action-links']}>
			<span className={styles['action-link']} onClick={() => this.edit()}>Edit</span>
			<span className={styles['action-link']} onClick={() => this.delete()}>Delete</span>
		</div>
	)

	render() {
		const { article, teaser, stripe } = this.props;

		let admin = false;

		let { title, created, body, published } = article;

		return (
			<div className={styles['article'] + ' ' + (teaser ? styles['teaser'] : '') + ' ' + styles[stripe]}>
				<div className={styles.title}>{title}</div>
				<div className={styles.created}>{moment(created, 'X').format(DATE_FORMAT)}</div>
				{admin && <div className={styles.published}>Published: {published ? 'Yes' : 'No'}</div>}
				<div className={styles.body}>
					{!teaser ? body : <Truncate lines={3}>{body}</Truncate>}
				</div>
				{admin && this.links}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	articles: state.articles,
	user: state.userData.users.find(user => user._id === state.userData.currentId)
});

export default connect(mapStateToProps)(Article);