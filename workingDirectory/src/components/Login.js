// Login.js
import { Auth } from "aws-amplify";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import React, { Component } from 'react';

class Login extends Component {

	constructor() {
		super();
		this.state = {
			email: '',
			password: ''
		};

	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	successfulAuth = () => {
		this.props.userHasAuthenticated(true);
	}

	handleSubmit = async event => {
		event.preventDefault();

		try {
			await Auth.signIn(this.state.email, this.state.password);
			this.successfulAuth

		// this.props.history.push("/");
		} catch (e) {
			alert(e.message);
		}
	}

  render() {
  	return (
  		<div className="login">
	  		<form onSubmit={this.handleSubmit}>
		  		<FormGroup controlId="email" bsSize="large">
			  		<FormLabel>Email</FormLabel>
			  		<FormControl
				  		autoFocus
				  		type="email"
				  		value={this.state.email}
				  		onChange={this.handleChange}
			  		/>
		  		</FormGroup>
			  		<FormGroup controlId="password" bsSize="large">
			  		<FormLabel>Password</FormLabel>
			  		<FormControl
				  		value={this.state.password}
				  		onChange={this.handleChange}
				  		type="password"
			  		/>
		  		</FormGroup>
		  		<Button
			  		block
			  		bsSize="large"
			  		type="submit"
		  		>
		  		Login
		  		</Button>
	  		</form>
  		</div>
  		);
  }
}

export default Login;