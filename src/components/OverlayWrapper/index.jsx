import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring, presets } from 'react-motion';
import keycode from 'keycode';

import styles from './overlay-wrapper.module.less';

export default class OverlayWrapper extends Component {
	static propTypes = {
		name: PropTypes.string,
		show: PropTypes.bool.isRequired,
		children: PropTypes.node.isRequired,
		animate: PropTypes.bool,
		dismissOverlay: PropTypes.func.isRequired,
		id: PropTypes.string,
		classNames: PropTypes.string
	}

	componentDidMount() {
		document.removeEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
	}

	handleKeyDown(e) {
		if (e.keyCode === keycode('escape'))
			this.props.dismissOverlay();
	}

	click(e) {
		if (e.target === this.wrapper)
			this.props.dismissOverlay();
	}

	render() {
		let { animate, id, classNames, children, show } = this.props;

		if (typeof show === 'undefined')
			show = !!children;

		if (typeof animate === 'undefined')
			animate = true;

		let render = <div />;

		if (animate)
			render = (
				<TransitionMotion
					styles={show ? [{ key: '0', style: { transform: spring(1, presets.gentle), opacity: spring(1, presets.gentle) } }] : []}
					willEnter={() => ({ transform: 0, opacity: 0 })}
					willLeave={() => ({ transform: spring(0, presets.gentle), opacity: spring(0, presets.gentle) })}
				>
					{items => {
						return (
							<div>
								{items.map(item => {
									let { key, style } = item;

									return <div
													id={id}
													className={styles.wrapper + ((classNames && classNames.length) ? ' ' + classNames : '')}
													key={key}
													ref={wrapper => this.wrapper = wrapper}
													onClick={e => this.click(e)}
													style={{ transform: `scale(${style.transform})`, opacity: style.opacity }}
												>{children}</div>
								})}
							</div>
						);
					}}
				</TransitionMotion>
			);
		else if (show)
			render = <div id={id} className={`${styles.wrapper} ${classNames}`} onClick={e => this.click(e)}>{children}</div>;

		return render;
	}
}