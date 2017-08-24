import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';

export default class LinkList extends Component {
	static propTypes = {
		name: PropTypes.string,
		list: PropTypes.array.isRequired,
		activeClass: PropTypes.string
	};
	
	render() {
		let { activeClass } = this.props;

		return (
			<ul>
				{this.props.list.map(function(item) {
					return (
						<li key={item.id}>
							<Link activeOnlyWhenExact={item.activeOnlyWhenExact} to={item.to} activeClass={activeClass ? activeClass : ''}>
								<span>{item.text}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		);
	}
}