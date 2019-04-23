import React from 'react';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButtonDropdown,
	InputGroupDropdown,
	Input,
	Button,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { toggleLoginModal, userLoginAction } from '../actions'
import { bindActionCreators } from 'redux'
import { Auth } from "aws-amplify";


class LoginModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading:false,
			modal: false,
			loginWindowState:false,
			username:"admin@example.com",
			password:"Passw0rd!",
			loginError:"",
			userHasAuthenticated:false
		};

		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.props.toggleLoginWindowDispatch(this.props.loginWindowState)
	}

	updateUsername = (event) =>{
		this.setState({
			username: event.target.value
		});
	}

	updatePassword = (event) =>{
		this.setState({
			password: event.target.value
		});
	}


	userLogin = async ( ) =>{
		if(this.state.username.length != 0 && this.state.password.length != 0){
			try {
				await Auth.signIn(this.state.username, this.state.password);
				this.setState({
					userHasAuthenticated:true,
					loginError:""
				});
				this.props.userLoginDispatch({
					query:{
					tempToken:localStorage.userEmail, 
					authEmail:this.state.username
				}, 
				searchType:"modifyCartToken",
				yieldAction:"LOGIN_USER_UPDATE_LOCAL_VARS"
				})
	 		}




	 		catch (e) {
				this.setState({
					loginError: e.message,
					userHasAuthenticated:false
				})
			}
		}
	}


	loginErrorDisplay = () =>{
		if (this.state.loginError.length != 0 ) {
			return(
				<Alert id="unsuccesfullogin" color="danger">{this.state.loginError}</Alert>
			)
		}
		else if (this.state.userHasAuthenticated == true){
			return(
				<Alert id="succesfulogin" color="success">User logged in</Alert>
			)
		}
	}


	render() {
		return (
			<div>
			<Modal isOpen={this.props.loginWindowState} toggle={this.toggle} className={this.props.className}>
			<ModalHeader toggle={this.toggle}>React Web Store Login</ModalHeader>
			<ModalBody>


			<InputGroup>
				<Input 
				name="username"
				value={this.state.username} 
				onChange={this.updateUsername}
				placeholder="username"
				/>
			</InputGroup>


			<InputGroup>
				<Input
				name="password"
				type="password"
				value={this.state.password} 
				onChange={this.updatePassword}
				placeholder="password" />

			</InputGroup>


			</ModalBody>
			<ModalFooter id="fuck">
				{ this.loginErrorDisplay()}
				<Button id="submitlogin" color="success" onClick={this.userLogin}>login</Button>{' '}
 			</ModalFooter>
			</Modal>


			</div>

			
			);
	}
}



const mapDispatchToProps = (dispatch) => ({
	toggleLoginWindowDispatch: (toggle) => dispatch(toggleLoginModal(toggle)),
	userLoginDispatch: (userEmail) => dispatch(userLoginAction(userEmail)),
})


const mapStateToProps = state => {
	return {
		loginWindowState: state.loginWindowState,
		loading:state.loading,
	}
}
export default LoginModal = connect(mapStateToProps,mapDispatchToProps)(LoginModal);
