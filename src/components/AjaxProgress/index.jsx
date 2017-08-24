import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'
import ring from './images/ring.svg';
import styles from './ajax-progress.module.less';

export default class AjaxProgress extends PureComponent {
	static propTypes = {
		absolute: PropTypes.bool
	}

	render() {
		const { absolute } = this.props;

		return (
			<div id={styles.wrapper} className={ absolute ? styles['absolute'] : ''}>
				<img src={ring} alt="AJAX Loader" />
			</div>
		);
	}
}
