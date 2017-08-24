import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import styles from './route-transitions.module.less';

export default class RouteTransitions extends PureComponent {
	static propTypes = {
		name: PropTypes.string,
		isBefore: PropTypes.func,
		children: PropTypes.node,
		transitionName: PropTypes.string,
		transitionAppear: PropTypes.bool,
		transitionAppearTimeout: PropTypes.number,
		transitionEnterTimeout: PropTypes.number,
		transitionLeaveTimeout: PropTypes.number
	};

	render() {
		let { transitionName, transitionAppear, transitionAppearTimeout, transitionEnterTimeout, transitionLeaveTimeout, children } = this.props;

		transitionName = transitionName ? transitionName : 'slide';

		let transitionClass = transitionName + '-';

		return (
			<CSSTransitionGroup
				transitionName={{
					appear: styles[transitionClass + 'appear'],
					appearActive: styles[transitionClass + 'appear-active'],
					enter: styles[transitionClass + 'enter'],
					enterActive: styles[transitionClass + 'enter-active'],
					leave: styles[transitionClass + 'leave'],
					leaveActive: styles[transitionClass + 'leave-active']
				}}
				transitionAppear={transitionAppear ? transitionAppear : false}
				transitionAppearTimeout={transitionAppearTimeout ? transitionAppearTimeout : 1000}
				transitionEnterTimeout={transitionEnterTimeout ? transitionEnterTimeout : 500}
				transitionLeaveTimeout={transitionLeaveTimeout ? transitionLeaveTimeout : 500}
			>
				{children}
			</CSSTransitionGroup>
		);
	}
}
