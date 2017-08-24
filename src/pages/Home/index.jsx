import React, { Component } from 'react';
import Blog from 'containers/Articles';

export default class Index extends Component {
	render() {
		return (
			<div className="page">
				<h1>Home</h1>

				<Blog url={''} />
			</div>
		);
	}
}