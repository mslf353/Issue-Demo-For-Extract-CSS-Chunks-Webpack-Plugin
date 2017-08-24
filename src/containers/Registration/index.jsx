import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, propTypes as reduxFormPropTypes, change } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import validator from 'validator';

import styles from './registration.module.less';

class Registration extends Component {
	static propTypes = {
		...reduxFormPropTypes,
		validate: PropTypes.func.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		submitting: PropTypes.bool.isRequired,
		email: PropTypes.string,
		password: PropTypes.string,
		showSubmission: PropTypes.bool,
		errorMessage: PropTypes.string,
		dispatch: PropTypes.func.isRequired
	}

	componentDidMount() {
		this.email.getRenderedComponent().refs.component.focus();
	}

	submit() {
		let { dispatch } = this.props;

		dispatch(change('registration', 'password', ''));
		dispatch(change('registration', 'password-confirm', ''));
	}

	render() {
		const { handleSubmit, submitting, errorMessage } = this.props;

		return (
			<form id={styles['registration']} onSubmit={handleSubmit(() => this.submit())}>
				<Field
					name="email"
					type="email"
					component={TextField}
					hintText="Email"
					floatingLabelText="Email"
					fullWidth={true}
					ref={(input) => { this.email = input; }}
					withRef
					required />

				<Field
					name="password"
					type="password"
					component={TextField}
					hintText="Password"
					floatingLabelText="Password"
					fullWidth={true}
					required />
				
				<Field
					name="password-confirm"
					type="password"
					component={TextField}
					hintText="Password Confirmation"
					floatingLabelText="Password Confirmation"
					fullWidth={true}
					required />

				{errorMessage && <div className={styles['error-message']}>{errorMessage}</div>}

				<RaisedButton
					type="submit"
					label="Register"
					primary={true}
					fullWidth={true}
					disabled={submitting} />
			</form>
		);
	}
}

const validate = values => {
	const errors = {};

	if (!values.email)
		errors.email = 'Required';
	else if (!validator.isEmail(values.email))
		errors.email = 'Invalid Email';

	if (!values.password)
		errors.password = 'Required';
	else if (values.password.length < 8)
		errors.password = 'Password must be at least 8 characters';

	if (values.password != values['password-confirm'])
		errors['password-confirm'] = 'Passwords do not match';

	return errors;
}

export default connect()(reduxForm({
	form: 'registration',
	validate
})(Registration));