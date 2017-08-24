import React, { Component } from 'react';
import { connect } from 'react-redux';


import styles from './account.module.less';

class Account extends Component {
	render() {
		return (
			<div className="page">
				<h1>Account</h1>

				<div id={styles['account-information']}>
					<a href={'https://www.gravatar.com/'} target="_blank">
						<img id={styles['profile-photo']} src={'https://www.gravatar.com/avatar/'} alt="Profile Photo" />
					</a>
				</div>

				<div id={styles['account-forms']}>
				</div>
			</div>
		);
	}
}

export default connect()(Account);