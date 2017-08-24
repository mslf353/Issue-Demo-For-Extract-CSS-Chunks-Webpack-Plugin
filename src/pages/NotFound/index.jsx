import React, { Component } from 'react';

import styles from './styles.module.less';

export default class NotFound extends Component {
	render() {
		return (
			<div id={styles['not-found']} className="page">
				<h1>404</h1>
			</div>
		);
	}
}