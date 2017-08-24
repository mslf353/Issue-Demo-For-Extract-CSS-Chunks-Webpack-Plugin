import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import universal from 'react-universal-component'
import Header from 'containers/Header'
import Navigation from 'components/Navigation'
import AjaxProgress from 'components/AjaxProgress'

import RouteTransitions from 'components/RouteTransitions'

const Route = universal(props => import(`pages/${props.page}`), {
	minDelay: 800,
	loading: (
		<div style={{
				flex: 1,
				position: 'relative'
			}}>
			<AjaxProgress absolute={true} />
		</div>
	)
})


/*							<IndexRoute />
							<AboutRoute />
							{!isLoggedIn && <RegisterRoute />}
							<ContactRoute />
							{isLoggedIn && <AccountRoute />}
							<NotFoundRoute />

const universalRouteOptions = {
	loading: (
		<div style={{
				flex: 1,
				position: 'relative'
			}}>
			<AjaxProgress absolute={true} />
		</div>
	),
	minDelay: 800
}

const IndexRoute = universal(import('pages/Home'), universalRouteOptions)
const AboutRoute = universal(import('pages/About'), universalRouteOptions)
const RegisterRoute = universal(import('pages/Register'), universalRouteOptions)
const ContactRoute = universal(import('pages/Contact'), universalRouteOptions)
const AccountRoute = universal(import('pages/Account'), universalRouteOptions)
const NotFoundRoute = universal(import('pages/NotFound'), universalRouteOptions)*/

import { finishCreatingArticle, finishUpdatingArticle } from 'containers/Articles/actions'

import { REQUESTING, SENDING } from 'constants'

require('normalize.css/normalize.css')
require('animate.css/animate.min.css')
require('font-awesome/css/font-awesome.min.css')

import styles from './layout.module.less'

class MainLayout extends Component {
	static propTypes = {
		name: PropTypes.string,
		page: PropTypes.string.isRequired,
		displayAjaxProgress: PropTypes.bool.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	dismissLogin() {
	}

	closeEditor() {
		let { dispatch } = this.props

		dispatch(finishCreatingArticle())
		dispatch(finishUpdatingArticle())
	}
	
	render() {
		let { page, displayAjaxProgress } = this.props

		let menuList = generateMenuList(false)

		return (
			<div className={`${styles.container} ${displayAjaxProgress ? styles['no-scroll'] : ''}`}>
				<Helmet>
					<title>Demo</title>
					<meta name="description" content="Site Description" />
					<meta name="theme-color" content="#FFFFFF" />
				</Helmet>

				<div id={styles['page-wrapper']}>
					<Header />
					<Navigation list={menuList} />
					<div id={styles['body-wrapper']}>
						<RouteTransitions
							isBefore={(currentPath, previousPath) => {
								let previousMenuIndex = menuList.indexOf(menuList.find(menuItem => menuItem.to === previousPath))
								let currentMenuIndex = menuList.indexOf(menuList.find(menuItem => menuItem.to === currentPath))

								if (currentMenuIndex < previousMenuIndex)
									return true
								else
									return false
							}}

							transitionAppear={true}
						>
							<Route key={page} page={page} />
						</RouteTransitions>
					</div>
				</div>

				{displayAjaxProgress && <AjaxProgress />}
			</div>
		)
	}
}

let menuKey = 0

function makeMenuLink(menuLink) {
	return Object.assign(menuLink, { id: menuKey++ })
}

const homeLink = makeMenuLink({
	to: '/',
	activeOnlyWhenExact: true,
	text: 'Home'
})

const aboutLink = makeMenuLink({
	to: '/about',
	text: 'About'
})

const contactLink = makeMenuLink({
	to: '/contact',
	text: 'Contact'
})

const registerLink = makeMenuLink({
	to: '/register',
	text: 'Register'
})

const accountLink = makeMenuLink({
	to: '/account',
	text: 'Account'
})

const notFoundLink = makeMenuLink({
	to: '/404',
	text: '404'
})

function generateMenuList(isLoggedIn) {
	let menuList = [
		homeLink,
		aboutLink,
		contactLink
	]

	if (!isLoggedIn)
		menuList.push(registerLink)

	if (isLoggedIn)
		menuList.push(accountLink)

	menuList.push(notFoundLink)

	return menuList
}


/*							<Route exact path="/" component={IndexRoute} />
							<Route path="/about" component={AboutRoute} />
							{!isLoggedIn && <Route path="/register" component={RegisterRoute} />}
							<Route path="/contact" component={ContactRoute} />
							{isLoggedIn && <Route path="/account" component={AccountRoute} />}
							<Route component={NotFoundRoute} />*/

const mapStateToProps = state => ({
	page: state.page,
	displayAjaxProgress: 	state.articleData.fetchStatus === REQUESTING ||
												state.articleData.sendStatus === SENDING
})

export default connect(mapStateToProps)(MainLayout)