
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
import { toggleCartModalAction, userLoginAction, removeItemFromCartAction, fetchFromServer} from '../actions'
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
 
	componentDidMount(){
		console.log("cart modal mounted ")
		// fetch cart items from db using credentials
		this.fetchCartItemsFromDB()

	}

	fetchCartItemsFromDB(){
		console.log("fetchCartItemsFromDB function")
		this.props.fetchFromServer({
			query:this.props.userEmail, 
			searchType:"fetchCartItems",
			yieldAction:"FETCHED_CART_ITEMS"
		})
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
		console.log(typeof(this.props.cartItems))
		
		var cartPrice = 0.00

		if (this.props.cartItems.length > 0) {
			const renderMultiple = this.props.cartItems.map((item) => {
				cartPrice+= item.price
			})
		}
		this.state.totalPrice = cartPrice

		if (this.props.cartItems.length > 0) {
			const renderMultiple = this.props.cartItems.map((item) => 
			<div>
			<Row>
				<Col md={{ size: '1', offset: 0 }} >
					<img style={{width: 50, height: 50}} src={item.imageUrl+".jpeg"}></img>
				</Col>

				<Col md={{ size: '7', offset: 0 }} >
					{item.title}
				</Col>
				
				<Col>
					<Row md={{ size: '.5', offset: 0 }} >
						{"Price: $"+item.price.toFixed(2)}
					</Row>

					<Row md={{ size: '.5', offset: 0 }} >
						{"Quantity: "+item.quantity}
					</Row>
 				</Col>

				<Col md={{ size: '.5', offset: 0 }} >
					{"Subtotal: $"+(item.quantity*item.price).toFixed(2)}
				</Col>

				<Col md={{ size: '1', offset: 0 }} > 
					<Button 
						outline 
						color="danger"
						size="sm"
						onClick={() => 
							this.props.removeItemFromCartDispatch({
								searchType:"removeItemFromCart",
								yieldAction:"UPDATE_CART_DISPLAY",
								query:{
									userEmail:this.props.userEmail,
									productId:item.productID,
									usItemId:item.usItemId
								}
						})}
						>
						Remove
					</Button> 
				</Col>
 			</Row>
 			<Row>
 				<Col>
 					<hr
						style={{
						color: "#ffffff",
						backgroundColor: "#ffffff",
						height: 1
						}}
					/>
				</Col>
			</Row>
			</div>
 			)
 			 		return renderMultiple

		}
	
	}


	checkoutItems = () =>{
		this.props.fetchFromServer({
			query:this.props.userEmail, 
			searchType:"checkoutItems",
			yieldAction:"CHECKOUT_ITEMS_RETURN"
		})
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
				<Row  >
					<h4>
					{/* renders the total cart price */}
	 				{"Total:    $ "+this.state.totalPrice.toFixed(2)}
	 				</h4>
	 				</Row>
	 				<Row  >
	 				<Button 
							outline 
							color="info"
							size="lg"
							onClick={()=>this.checkoutItems()}
							>
							Checkout
						</Button> 
				</Row>
 			</ModalFooter>
			</Modal>


			</div>
			);
	}
}



const mapDispatchToProps = (dispatch) => ({
	toggleCartModalAction: (toggle) => dispatch(toggleCartModalAction(toggle)),
	userLoginDispatch: (userEmail) => dispatch(userLoginAction(userEmail)),
	removeItemFromCartDispatch: (searchObj) => dispatch(removeItemFromCartAction(searchObj)),
	fetchFromServer: (text) => dispatch(fetchFromServer(text)),

})


const mapStateToProps = state => {
	return {
		cartModalState: state.cartModalState,
		loading:state.loading,
		cartItems:state.cartItems,
		userEmail:state.userEmail,
	}
}
export default CartModal = connect(mapStateToProps,mapDispatchToProps)(CartModal);
