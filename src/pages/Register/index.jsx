import React, { Component } from 'react';

import Registration from 'containers/Registration';

import styles from './styles.module.less';

export default class Register extends Component {
	render() {
		return (
			<div id={styles.register} className="page">
				<h1>Register</h1>

				<Registration/>
			</div>
		);
	}
}