
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
import { toggleCartModalAction, userLoginAction } from '../actions'
import { bindActionCreators } from 'redux'
import { Auth } from "aws-amplify";


class CartModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading:false,
			modal: false,
			cartModalState:false,
			username:"",
			password:"",
			loginError:"",
			userHasAuthenticated:false
		};

		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.props.toggleCartModalAction(this.props.cartModalState)
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
				this.props.userLoginDispatch(this.state.username)
				console.log("logged in")
	 		} catch (e) {
				// alert(e.message);
				console.log("not logged int")
				console.log(e.message)
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
				<Alert color="danger">{this.state.loginError}</Alert>
			)
		}
		else if (this.state.userHasAuthenticated == true){
			return(
				<Alert color="success">User logged in</Alert>
			)
		}
	}

	renderCartItems = () =>{
		console.log("HERE ARE THE CART ITEMS")
		console.log(this.props.cartItems)
		const renderMultiple = this.props.cartItems.map((item) => 
				<div className="contact-card">
					{item.productId}
					{" "}
					{item.usItemId}
  				</div>
 		)
 		return renderMultiple
	}


	render() {
		return (
			<div>
			<Modal isOpen={this.props.cartModalState} toggle={this.toggle} className={this.props.className}>
			<ModalHeader toggle={this.toggle}>React Web Store Login</ModalHeader>
			<ModalBody>
				<div className="contacts">{this.renderCartItems()}</div>
			

			</ModalBody>
			<ModalFooter>
				
 			</ModalFooter>
			</Modal>


			</div>
			);
	}
}



const mapDispatchToProps = (dispatch) => ({
	toggleCartModalAction: (toggle) => dispatch(toggleCartModalAction(toggle)),
	userLoginDispatch: (userEmail) => dispatch(userLoginAction(userEmail)),
})


const mapStateToProps = state => {
	return {
		cartModalState: state.cartModalState,
		loading:state.loading,
		cartItems:state.cartItems,
	}
}
export default CartModal = connect(mapStateToProps,mapDispatchToProps)(CartModal);
