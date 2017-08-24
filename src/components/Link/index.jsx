import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'redux-first-router-link'

export default class Link extends PureComponent {
	static propTypes = {
		children: PropTypes.node,
		label: PropTypes.string,
		to: PropTypes.string.isRequired,
		activeClass: PropTypes.string,
		activeOnlyWhenExact: PropTypes.bool
	}

	render() {
		let { children, label, to, activeClass, activeOnlyWhenExact } = this.props

		return (
			<NavLink
				to={to}
				activeClassName={activeClass}
				exact={activeOnlyWhenExact}
			>
				{label}{children}
			</NavLink>
		)
	}
}