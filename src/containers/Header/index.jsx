import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from 'components/Link';

import styles from './header.module.less';

class Header extends Component {
	static propTypes = {
		name: PropTypes.string,
		dispatch: PropTypes.func.isRequired
	}

	displayLogin() {  }
	logout() {  }

	render() {
		let userLink = <div id={styles['user-link']} onClick={() => this.displayLogin()}>Login</div>;

		return (
			<header id={styles.container}>
				<div id={styles.header}>
					<Link to="/">
						<span>Environment: </span>
						<span className={styles.sizzle}>{__NODE_ENV__}</span>
					</Link>
				</div>
				{userLink}
			</header>
		);
	}
}

export default connect()(Header);