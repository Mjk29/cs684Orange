
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
	Container,
	Row,
	Col,

} from 'reactstrap';
import { connect } from 'react-redux';
import { toggleCartModalAction, userLoginAction, removeItemFromCartAction } from '../actions'
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
			userHasAuthenticated:false,
			totalPrice:0
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

	removeItemFromCart = (item) =>{
		console.log("ASDASDASDASD")
		console.log(item)
	}


// renders the item output for the cart modal
// maps the items in store.cartItems and displays 
	renderCartItems = () =>{
		console.log("HERE ARE THE CART ITEMS")
		console.log(this.props.cartItems)
		
		var cartPrice = 0.00
		// adds up all item pricein the store
		// this.props.cartItems.map((item) => 
		// 	{cartPrice+=item.price}
		// )
		// // sets the totalprice state to the sum of the item prices
		// this.state.totalPrice = cartPrice

		// const renderMultiple = this.props.cartItems.map((item) => 
		// 	<div>
		// 	<Row>
		// 	<Col md={{ size: 2, offset: 0 }} >
		// 		<img style={{width: 50, height: 50}} src={item.imageUrl+".jpeg"}></img>
		// 	</Col>
		// 	<Col md={{ size: 6, offset: 0 }} >
		// 		{item.title}
		// 		</Col>
		// 	<Col md={{ size: 2, offset: 0 }} >
		// 		{"$ "+item.price.toFixed(2)}
		// 	</Col>
		// 	<Col> 
		// 		<Button 
		// 		outline 
		// 		color="danger"
		// 		size="sm"
		// 		onClick={() => this.props.removeItemFromCartDispatch({productId:item.productId, usItemId:item.usItemId})}
		// 		>
		// 		Remove
		// 		</Button> 
		// 	</Col>
 	// 		</Row>
		// 	</div>
 	// 	)
 	// 	return renderMultiple
	}




 	render() {
		return (
			<div>
			<Modal 
				size="xl"
	 			isOpen={this.props.cartModalState} 
				toggle={this.toggle} 
				className={this.props.className}
			>
			<ModalHeader toggle={this.toggle}>React Web Store Login</ModalHeader>
			<ModalBody>
			<Container>
				{/* Creates a html table for all items in tcartItems  */}
 				<div>{this.renderCartItems()}</div>

			</Container>
			</ModalBody>
			<ModalFooter>
				{/* renders the total cart price */}
 				{"Total:    $ "+this.state.totalPrice.toFixed(2)}
 			</ModalFooter>
			</Modal>


			</div>
			);
	}
}



const mapDispatchToProps = (dispatch) => ({
	toggleCartModalAction: (toggle) => dispatch(toggleCartModalAction(toggle)),
	userLoginDispatch: (userEmail) => dispatch(userLoginAction(userEmail)),
	removeItemFromCartDispatch: (itemKey) => dispatch(removeItemFromCartAction(itemKey)),

})


const mapStateToProps = state => {
	return {
		cartModalState: state.cartModalState,
		loading:state.loading,
		cartItems:state.cartItems,
	}
}
export default CartModal = connect(mapStateToProps,mapDispatchToProps)(CartModal);
