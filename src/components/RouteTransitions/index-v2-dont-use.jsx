import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import CSSTransition from 'react-transition-group/CSSTransition';

import styles from './route-transitions.module.less';

export default class RouteTransitions extends PureComponent {
	static propTypes = {
		name: PropTypes.string,
		isBefore: PropTypes.func,
		children: PropTypes.node,
		transitionName: PropTypes.string,
		appear: PropTypes.bool,
		appearTimeout: PropTypes.number,
		enterTimeout: PropTypes.number,
		leaveTimeout: PropTypes.number
	};

	render() {
		let { isBefore, transitionName, appear, appearTimeout, enterTimeout, leaveTimeout, children } = this.props;

		transitionName = transitionName ? transitionName : 'slide';

		return <Route render={({ location }) => {
			let transitionClass = transitionName + '-';

			if (this.previousPath && isBefore && isBefore(location.pathname, this.previousPath))
				transitionClass += 'before-';

			this.previousPath = location.pathname;

			return (
				<TransitionGroup>
					<CSSTransition
						classNames={{
							appear: styles[transitionClass + 'appear'],
							appearActive: styles[transitionClass + 'appear-active'],
							enter: styles[transitionClass + 'enter'],
							enterActive: styles[transitionClass + 'enter-active'],
							exit: styles[transitionClass + 'exit'],
							exitActive: styles[transitionClass + 'exit-active']
						}}
						appear={appear ? appear : false}
						timeout={{
							enter: appearTimeout ? appearTimeout : 100000,
							exit: enterTimeout ? enterTimeout : 50000,
							appear: leaveTimeout ? leaveTimeout : 50000
						}}
					>
						<Switch key={location.key} location={location}>
							{children}
						</Switch>
					</CSSTransition>
				</TransitionGroup>
			);
		}} />
	}
}
