import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import { createArticle, invalidateArticles, fetchArticles } from './actions';

import Article from 'components/Article';

import styles from './articles.module.less';

class Articles extends Component {
	static propTypes = {
		articles: PropTypes.array,
		lastUpdated: PropTypes.number,
		isValid: PropTypes.bool,
		url: PropTypes.string,
		dispatch: PropTypes.func.isRequired
	}

	componentWillMount() {
		const { dispatch, url, isValid } = this.props;

		if (url && !isValid) {
			dispatch(invalidateArticles(url));
			dispatch(fetchArticles(url));
		}
	}

	createArticle() {
		this.props.dispatch(createArticle());
	}

	render() {
		const { articles } = this.props;

		let admin = false;

		return (
			<div id={styles['articles-container']}>
				{admin && <div id={styles['create-button-wrapper']}><RaisedButton
							label="Create Article"
							secondary={true}
							onClick={() => this.createArticle()} /></div>}

				<div id={styles['articles']}>
					{articles.map((article, index) =>
						<Article
							key={article._id}
							article={article}
							teaser={true}
							stripe={index % 2 === 0 ? 'even' : 'odd'} />
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	articles: state.articleData.articles,
	category: state.articleData.category,
	sendingArticleId: state.articleData.sendingArticleId,
	lastUpdated: state.articleData.lastUpdated,
	isValid: state.articleData.isValid
});

export default connect(mapStateToProps)(Articles);