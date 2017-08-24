import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinkList from 'components/LinkList';

import styles from './navigation.module.less';

export default class Navigation extends Component {
	static propTypes = {
		name: PropTypes.string,
		list: PropTypes.array.isRequired
	};

	render() {
		return (
			<nav id={styles.nav}>
				<LinkList list={this.props.list} activeClass={styles.active} />
			</nav>
		);
	}
}